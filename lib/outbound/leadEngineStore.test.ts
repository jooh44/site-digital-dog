import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, describe, expect, it } from 'vitest'
import { DEFAULT_LEAD_ENGINE_SCHEMA_PATH } from './paths.ts'
import {
  completeSearchRun,
  createSearchRun,
  getEmailCampaign,
  listEmailEligibleTargetsForCampaign,
  listEmailJobsForCampaign,
  listShortlistForCampaign,
  markEmailJobScheduled,
  openLeadEngineDatabase,
  upsertCampaign,
  upsertEmailCampaign,
  upsertEmailJob,
  upsertCnsaRegistryLead,
  upsertOfficialSiteLead,
  upsertOabRegistryLead,
} from './leadEngineStore.ts'
import type { CnsaRegistryLead, OabRegistryLead, OfficialSiteEnrichment } from './types.ts'

const tempDirectories: string[] = []

afterEach(() => {
  for (const directory of tempDirectories.splice(0)) {
    rmSync(directory, { force: true, recursive: true })
  }
})

describe('leadEngineStore', () => {
  it('deduplica a mesma lead da OAB por external_id e preserva o shortlist', () => {
    const directory = mkdtempSync(join(tmpdir(), 'digital-dog-lead-engine-'))
    const dbPath = join(directory, 'lead-engine.sqlite')
    const schemaPath = join(directory, 'schema.sql')

    tempDirectories.push(directory)

    const sharedSchema = readFileSync(DEFAULT_LEAD_ENGINE_SCHEMA_PATH, 'utf8')
    writeFileSync(schemaPath, sharedSchema)

    const db = openLeadEngineDatabase({ dbPath, schemaPath })
    const nowIso = '2026-04-22T12:00:00.000Z'

    upsertCampaign(db, {
      id: 'camp-advocacia-trabalhista-curitiba',
      name: 'Advocacia Trabalhista Curitiba',
      niche: 'advocacia-trabalhista',
      city: 'CURITIBA',
      status: 'active',
    }, nowIso)

    const searchRunId = createSearchRun(db, {
      campaignId: 'camp-advocacia-trabalhista-curitiba',
      sourceChannel: 'oab_registry',
      toolName: 'oab_pr_public_directory',
      queryText: 'cidade=CURITIBA&especialidade=6&situacao=A',
    }, nowIso)

    const lead: OabRegistryLead = {
      canonicalName: 'HELIO GOMES COELHO JUNIOR',
      city: 'CURITIBA',
      externalId: 'PR:A:7007',
      inscriptionTypeCode: 'A',
      inscriptionTypeLabel: 'ADVOGADO',
      oabNumber: '7007',
      queryUrl: 'https://www.oabpr.org.br/servicos-consulta-de-advogados/lista-de-advogados/?cidade=CURITIBA&especialidade=6&situacao=A',
      registryProvider: 'oab_pr_public_directory',
      sourceConfidence: 0.82,
      sourceUrl: 'https://www.oabpr.org.br/servicos-consulta-de-advogados/consulta-de-advogado/?oabn=7007&tpinsc=A',
      specialtyCode: '6',
      specialtyLabel: 'Trabalhista',
      state: 'PR',
    }

    upsertOabRegistryLead(db, lead, searchRunId, nowIso)
    upsertOabRegistryLead(db, lead, searchRunId, '2026-04-22T12:05:00.000Z')
    completeSearchRun(db, searchRunId, 1, '2026-04-22T12:05:00.000Z')

    const organizations = db.prepare('SELECT COUNT(*) AS count FROM organizations').get() as { count: number }
    const sources = db.prepare('SELECT COUNT(*) AS count FROM organization_sources').get() as { count: number }
    const evidence = db.prepare('SELECT COUNT(*) AS count FROM evidence').get() as { count: number }
    const shortlist = listShortlistForCampaign(db, 'camp-advocacia-trabalhista-curitiba', 15)

    expect(organizations.count).toBe(1)
    expect(sources.count).toBe(1)
    expect(evidence.count).toBe(3)
    expect(shortlist).toEqual([
      expect.objectContaining({
        canonicalName: 'HELIO GOMES COELHO JUNIOR',
        externalId: 'PR:A:7007',
        nextStep: 'official_site_lookup',
      }),
    ])
  })

  it('promove uma lead para ready_for_review quando o site oficial entrega contato publico', () => {
    const directory = mkdtempSync(join(tmpdir(), 'digital-dog-lead-engine-'))
    const dbPath = join(directory, 'lead-engine.sqlite')
    const schemaPath = join(directory, 'schema.sql')

    tempDirectories.push(directory)

    const sharedSchema = readFileSync(DEFAULT_LEAD_ENGINE_SCHEMA_PATH, 'utf8')
    writeFileSync(schemaPath, sharedSchema)

    const db = openLeadEngineDatabase({ dbPath, schemaPath })
    const nowIso = '2026-04-22T12:00:00.000Z'

    upsertCampaign(db, {
      id: 'camp-advocacia-trabalhista-curitiba',
      name: 'Advocacia Trabalhista Curitiba',
      niche: 'advocacia-trabalhista',
      city: 'CURITIBA',
      status: 'active',
    }, nowIso)

    const registrySearchRunId = createSearchRun(db, {
      campaignId: 'camp-advocacia-trabalhista-curitiba',
      sourceChannel: 'oab_registry',
      toolName: 'oab_pr_public_directory',
      queryText: 'cidade=CURITIBA&especialidade=6&situacao=A',
    }, nowIso)

    const lead: OabRegistryLead = {
      canonicalName: 'HELIO GOMES COELHO JUNIOR',
      city: 'CURITIBA',
      externalId: 'PR:A:7007',
      inscriptionTypeCode: 'A',
      inscriptionTypeLabel: 'ADVOGADO',
      oabNumber: '7007',
      queryUrl: 'https://www.oabpr.org.br/servicos-consulta-de-advogados/lista-de-advogados/?cidade=CURITIBA&especialidade=6&situacao=A',
      registryProvider: 'oab_pr_public_directory',
      sourceConfidence: 0.82,
      sourceUrl: 'https://www.oabpr.org.br/servicos-consulta-de-advogados/consulta-de-advogado/?oabn=7007&tpinsc=A',
      specialtyCode: '6',
      specialtyLabel: 'Trabalhista',
      state: 'PR',
    }

    upsertOabRegistryLead(db, lead, registrySearchRunId, nowIso)
    completeSearchRun(db, registrySearchRunId, 1, '2026-04-22T12:05:00.000Z')

    const officialSiteRunId = createSearchRun(db, {
      campaignId: 'camp-advocacia-trabalhista-curitiba',
      sourceChannel: 'official_site',
      toolName: 'manual_verified_official_site_fetch',
      queryText: 'camp-advocacia-trabalhista-curitiba-official-site-seeds.json',
    }, '2026-04-22T12:10:00.000Z')

    const enrichment: OfficialSiteEnrichment = {
      canonicalName: 'HELIO GOMES COELHO JUNIOR',
      contactPageUrl: 'https://gcb.adv.br/contato/',
      contacts: [
        {
          confidence: 0.95,
          contactType: 'email',
          isPrimary: true,
          label: 'profile_page',
          sourceUrl: 'https://gcb.adv.br/helio-gomes-coelho-junior/',
          value: 'helio@gcb.adv.br',
        },
        {
          confidence: 0.91,
          contactType: 'email',
          label: 'contact_page',
          sourceUrl: 'https://gcb.adv.br/contato/',
          value: 'contato@gcb.adv.br',
        },
        {
          confidence: 0.91,
          contactType: 'phone',
          isPrimary: true,
          label: 'contact_page',
          sourceUrl: 'https://gcb.adv.br/contato/',
          value: '(41) 3014-4040',
        },
      ],
      evidence: [
        {
          sourceUrl: 'https://gcb.adv.br/helio-gomes-coelho-junior/',
          type: 'official_office_name',
          value: 'GOMES COELHO E BORDIN - Sociedade de Advogados',
        },
        {
          sourceUrl: 'https://gcb.adv.br/contato/',
          type: 'official_contact_page',
          value: 'https://gcb.adv.br/contato/',
        },
      ],
      externalId: 'PR:A:7007',
      officeName: 'GOMES COELHO E BORDIN - Sociedade de Advogados',
      primaryEmail: 'helio@gcb.adv.br',
      primaryPhone: '(41) 3014-4040',
      rawPayloadJson: '{"seed":"manual"}',
      sourceConfidence: 0.95,
      sourceTitle: 'Hélio Gomes Coelho Júnior | GOMES COELHO E BORDIN - Sociedade de Advogados',
      sourceUrl: 'https://gcb.adv.br/helio-gomes-coelho-junior/',
      websiteDomain: 'gcb.adv.br',
      websiteUrl: 'https://gcb.adv.br/',
    }

    upsertOfficialSiteLead(db, enrichment, officialSiteRunId, '2026-04-22T12:15:00.000Z')
    completeSearchRun(db, officialSiteRunId, 1, '2026-04-22T12:15:00.000Z')

    const organization = db.prepare(`
      SELECT
        website_url AS websiteUrl,
        website_domain AS websiteDomain,
        primary_email AS primaryEmail,
        primary_phone AS primaryPhone,
        status
      FROM organizations
    `).get() as {
      primaryEmail: string | null
      primaryPhone: string | null
      status: string
      websiteDomain: string | null
      websiteUrl: string | null
    }
    const contacts = db.prepare('SELECT COUNT(*) AS count FROM contacts').get() as { count: number }
    const officialSources = db.prepare(`
      SELECT COUNT(*) AS count
      FROM organization_sources
      WHERE source_channel = 'official_site'
    `).get() as { count: number }
    const shortlist = listShortlistForCampaign(db, 'camp-advocacia-trabalhista-curitiba', 15)

    expect(organization).toEqual({
      primaryEmail: 'helio@gcb.adv.br',
      primaryPhone: '(41) 3014-4040',
      status: 'ready_for_review',
      websiteDomain: 'gcb.adv.br',
      websiteUrl: 'https://gcb.adv.br/',
    })
    expect(contacts.count).toBe(3)
    expect(officialSources.count).toBe(1)
    expect(shortlist).toEqual([
      expect.objectContaining({
        canonicalName: 'HELIO GOMES COELHO JUNIOR',
        nextStep: 'review',
        officeName: 'GOMES COELHO E BORDIN - Sociedade de Advogados',
        officialSiteUrl: 'https://gcb.adv.br/helio-gomes-coelho-junior/',
        primaryEmail: 'helio@gcb.adv.br',
        primaryPhone: '(41) 3014-4040',
        websiteUrl: 'https://gcb.adv.br/',
      }),
    ])
  })

  it('aceita seeding societario via cnsa_registry no mesmo fluxo de enrichment oficial', () => {
    const directory = mkdtempSync(join(tmpdir(), 'digital-dog-lead-engine-'))
    const dbPath = join(directory, 'lead-engine.sqlite')
    const schemaPath = join(directory, 'schema.sql')

    tempDirectories.push(directory)

    const sharedSchema = readFileSync(DEFAULT_LEAD_ENGINE_SCHEMA_PATH, 'utf8')
    writeFileSync(schemaPath, sharedSchema)

    const db = openLeadEngineDatabase({ dbPath, schemaPath })
    const nowIso = '2026-04-22T15:00:00.000Z'

    upsertCampaign(db, {
      id: 'camp-advocacia-trabalhista-curitiba',
      name: 'Advocacia Trabalhista Curitiba',
      niche: 'advocacia-trabalhista',
      city: 'CURITIBA',
      status: 'active',
    }, nowIso)

    const registrySearchRunId = createSearchRun(db, {
      campaignId: 'camp-advocacia-trabalhista-curitiba',
      sourceChannel: 'cnsa_registry',
      toolName: 'manual_verified_cnsa_seed',
      queryText: 'camp-advocacia-trabalhista-curitiba-cnsa-registry-seeds.json',
    }, nowIso)

    const lead: CnsaRegistryLead = {
      canonicalName: 'CARVALHO E ELIAS SOCIEDADE DE ADVOGADOS',
      city: 'CURITIBA',
      externalId: 'PR:SOC:carvalho-elias',
      queryUrl: 'https://cnsa.oab.org.br/',
      registryProvider: 'cnsa_public_search_manual_seed',
      registryTypeLabel: 'SOCIEDADE DE ADVOGADOS',
      sourceConfidence: 0.9,
      sourceUrl: 'https://cnsa.oab.org.br/',
      specialtyLabel: 'Trabalhista',
      state: 'PR',
    }

    upsertCnsaRegistryLead(db, lead, registrySearchRunId, nowIso)
    completeSearchRun(db, registrySearchRunId, 1, '2026-04-22T15:01:00.000Z')

    const officialSiteRunId = createSearchRun(db, {
      campaignId: 'camp-advocacia-trabalhista-curitiba',
      sourceChannel: 'official_site',
      toolName: 'manual_verified_official_site_fetch',
      queryText: 'camp-advocacia-trabalhista-curitiba-cnsa-registry-seeds.json',
    }, '2026-04-22T15:02:00.000Z')

    const enrichment: OfficialSiteEnrichment = {
      canonicalName: 'CARVALHO E ELIAS SOCIEDADE DE ADVOGADOS',
      contactPageUrl: 'https://carvalhoelias.adv.br/contato/',
      contacts: [
        {
          confidence: 0.95,
          contactType: 'email',
          isPrimary: true,
          label: 'profile_page',
          sourceUrl: 'https://carvalhoelias.adv.br/direito_do_trabalho/',
          value: 'controladoria@carvalhoelias.adv.br',
        },
        {
          confidence: 0.91,
          contactType: 'phone',
          isPrimary: true,
          label: 'contact_page',
          sourceUrl: 'https://carvalhoelias.adv.br/contato/',
          value: '(41) 3046-2259',
        },
      ],
      evidence: [
        {
          sourceUrl: 'https://carvalhoelias.adv.br/direito_do_trabalho/',
          type: 'official_office_name',
          value: 'Carvalho & Elias Sociedade de Advogados',
        },
      ],
      externalId: 'PR:SOC:carvalho-elias',
      officeName: 'Carvalho & Elias Sociedade de Advogados',
      primaryEmail: 'controladoria@carvalhoelias.adv.br',
      primaryPhone: '(41) 3046-2259',
      rawPayloadJson: '{"seed":"manual-cnsa"}',
      sourceConfidence: 0.95,
      sourceTitle: 'Direito do Trabalho - Carvalho & Elias Sociedade de Advogados',
      sourceUrl: 'https://carvalhoelias.adv.br/direito_do_trabalho/',
      websiteDomain: 'carvalhoelias.adv.br',
      websiteUrl: 'https://carvalhoelias.adv.br/',
    }

    upsertOfficialSiteLead(db, enrichment, officialSiteRunId, '2026-04-22T15:03:00.000Z')
    completeSearchRun(db, officialSiteRunId, 1, '2026-04-22T15:03:00.000Z')

    const organization = db.prepare(`
      SELECT
        canonical_name AS canonicalName,
        primary_email AS primaryEmail,
        primary_phone AS primaryPhone,
        status,
        website_domain AS websiteDomain
      FROM organizations
    `).get() as {
      canonicalName: string
      primaryEmail: string | null
      primaryPhone: string | null
      status: string
      websiteDomain: string | null
    }
    const shortlist = listShortlistForCampaign(db, 'camp-advocacia-trabalhista-curitiba', 15)

    expect(organization).toEqual({
      canonicalName: 'CARVALHO E ELIAS SOCIEDADE DE ADVOGADOS',
      primaryEmail: 'controladoria@carvalhoelias.adv.br',
      primaryPhone: '(41) 3046-2259',
      status: 'ready_for_review',
      websiteDomain: 'carvalhoelias.adv.br',
    })
    expect(shortlist).toEqual([
      expect.objectContaining({
        canonicalName: 'CARVALHO E ELIAS SOCIEDADE DE ADVOGADOS',
        nextStep: 'review',
        officeName: 'Carvalho & Elias Sociedade de Advogados',
        primaryEmail: 'controladoria@carvalhoelias.adv.br',
        primaryPhone: '(41) 3046-2259',
        websiteUrl: 'https://carvalhoelias.adv.br/',
      }),
    ])
  })

  it('prepara e agenda jobs de email no mesmo SQLite canonico', () => {
    const directory = mkdtempSync(join(tmpdir(), 'digital-dog-lead-engine-'))
    const dbPath = join(directory, 'lead-engine.sqlite')
    const schemaPath = join(directory, 'schema.sql')

    tempDirectories.push(directory)

    const sharedSchema = readFileSync(DEFAULT_LEAD_ENGINE_SCHEMA_PATH, 'utf8')
    writeFileSync(schemaPath, sharedSchema)

    const db = openLeadEngineDatabase({ dbPath, schemaPath })
    const nowIso = '2026-04-22T18:00:00.000Z'

    upsertCampaign(db, {
      id: 'camp-advocacia-trabalhista-curitiba',
      name: 'Advocacia Trabalhista Curitiba',
      niche: 'advocacia-trabalhista',
      city: 'CURITIBA',
      status: 'active',
    }, nowIso)

    const registrySearchRunId = createSearchRun(db, {
      campaignId: 'camp-advocacia-trabalhista-curitiba',
      sourceChannel: 'oab_registry',
      toolName: 'oab_pr_public_directory',
      queryText: 'cidade=CURITIBA&especialidade=6&situacao=A',
    }, nowIso)

    upsertOabRegistryLead(db, {
      canonicalName: 'HELIO GOMES COELHO JUNIOR',
      city: 'CURITIBA',
      externalId: 'PR:A:7007',
      inscriptionTypeCode: 'A',
      inscriptionTypeLabel: 'ADVOGADO',
      oabNumber: '7007',
      queryUrl: 'https://www.oabpr.org.br/servicos-consulta-de-advogados/lista-de-advogados/?cidade=CURITIBA&especialidade=6&situacao=A',
      registryProvider: 'oab_pr_public_directory',
      sourceConfidence: 0.82,
      sourceUrl: 'https://www.oabpr.org.br/servicos-consulta-de-advogados/consulta-de-advogado/?oabn=7007&tpinsc=A',
      specialtyCode: '6',
      specialtyLabel: 'Trabalhista',
      state: 'PR',
    }, registrySearchRunId, nowIso)
    completeSearchRun(db, registrySearchRunId, 1, '2026-04-22T18:05:00.000Z')

    const officialSiteRunId = createSearchRun(db, {
      campaignId: 'camp-advocacia-trabalhista-curitiba',
      sourceChannel: 'official_site',
      toolName: 'manual_verified_official_site_fetch',
      queryText: 'camp-advocacia-trabalhista-curitiba-official-site-seeds.json',
    }, '2026-04-22T18:10:00.000Z')

    upsertOfficialSiteLead(db, {
      canonicalName: 'HELIO GOMES COELHO JUNIOR',
      contactPageUrl: 'https://gcb.adv.br/contato/',
      contacts: [
        {
          confidence: 0.95,
          contactType: 'email',
          isPrimary: true,
          label: 'profile_page',
          sourceUrl: 'https://gcb.adv.br/helio-gomes-coelho-junior/',
          value: 'helio@gcb.adv.br',
        },
      ],
      evidence: [
        {
          sourceUrl: 'https://gcb.adv.br/helio-gomes-coelho-junior/',
          type: 'official_office_name',
          value: 'GOMES COELHO E BORDIN - Sociedade de Advogados',
        },
      ],
      externalId: 'PR:A:7007',
      officeName: 'GOMES COELHO E BORDIN - Sociedade de Advogados',
      primaryEmail: 'helio@gcb.adv.br',
      primaryPhone: '(41) 3014-4040',
      rawPayloadJson: '{"seed":"manual"}',
      sourceConfidence: 0.95,
      sourceTitle: 'Hélio Gomes Coelho Júnior | GOMES COELHO E BORDIN - Sociedade de Advogados',
      sourceUrl: 'https://gcb.adv.br/helio-gomes-coelho-junior/',
      websiteDomain: 'gcb.adv.br',
      websiteUrl: 'https://gcb.adv.br/',
    }, officialSiteRunId, '2026-04-22T18:15:00.000Z')
    completeSearchRun(db, officialSiteRunId, 1, '2026-04-22T18:15:00.000Z')

    const eligibleTargets = listEmailEligibleTargetsForCampaign(db, 'camp-advocacia-trabalhista-curitiba', 10)

    expect(eligibleTargets).toEqual([
      expect.objectContaining({
        canonicalName: 'HELIO GOMES COELHO JUNIOR',
        officeName: 'GOMES COELHO E BORDIN - Sociedade de Advogados',
        primaryEmail: 'helio@gcb.adv.br',
      }),
    ])

    upsertEmailCampaign(db, {
      id: 'camp-advocacia-trabalhista-curitiba-email-01',
      leadCampaignId: 'camp-advocacia-trabalhista-curitiba',
      name: 'Advocacia Trabalhista Curitiba - onda 1',
      fromEmail: 'Digital Dog <contato@digitaldog.pet>',
      replyToEmail: 'johny@digitaldog.pet',
      cadenceMinutes: 10,
      plannedStartAt: '2026-04-23T13:00:00-03:00',
      status: 'draft',
    }, '2026-04-22T18:20:00.000Z')

    const jobId = upsertEmailJob(db, {
      emailCampaignId: 'camp-advocacia-trabalhista-curitiba-email-01',
      organizationId: eligibleTargets[0].id,
      toEmail: eligibleTargets[0].primaryEmail!,
      subject: 'GOMES COELHO E BORDIN - Sociedade de Advogados e a captação digital em Curitiba',
      htmlBody: '<p>Mensagem</p>',
      textBody: 'Mensagem',
      personalizationJson: '{"officeName":"GOMES COELHO E BORDIN - Sociedade de Advogados"}',
      status: 'draft',
    }, '2026-04-22T18:20:00.000Z')

    markEmailJobScheduled(
      db,
      jobId,
      '2026-04-23T16:00:00.000Z',
      're_test_123',
      'digital-dog:test:job:1',
      '2026-04-22T18:25:00.000Z'
    )

    const campaign = getEmailCampaign(db, 'camp-advocacia-trabalhista-curitiba-email-01')
    const jobs = listEmailJobsForCampaign(db, 'camp-advocacia-trabalhista-curitiba-email-01')

    expect(campaign).toEqual(expect.objectContaining({
      cadenceMinutes: 10,
      fromEmail: 'Digital Dog <contato@digitaldog.pet>',
      leadCampaignId: 'camp-advocacia-trabalhista-curitiba',
      plannedStartAt: '2026-04-23T13:00:00-03:00',
      replyToEmail: 'johny@digitaldog.pet',
      status: 'draft',
    }))
    expect(jobs).toEqual([
      expect.objectContaining({
        id: jobId,
        resendEmailId: 're_test_123',
        resendIdempotencyKey: 'digital-dog:test:job:1',
        scheduledAt: '2026-04-23T16:00:00.000Z',
        status: 'scheduled',
        toEmail: 'helio@gcb.adv.br',
      }),
    ])

    expect(listEmailEligibleTargetsForCampaign(db, 'camp-advocacia-trabalhista-curitiba', 10)).toEqual([])
    expect(listEmailEligibleTargetsForCampaign(db, 'camp-advocacia-trabalhista-curitiba', 10, false)).toEqual([
      expect.objectContaining({
        canonicalName: 'HELIO GOMES COELHO JUNIOR',
        primaryEmail: 'helio@gcb.adv.br',
      }),
    ])
  })
})
