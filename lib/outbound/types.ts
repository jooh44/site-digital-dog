export type RegistrySourceChannel = 'oab_registry' | 'cnsa_registry'

export type OabRegistrySearchInput = {
  campaignId: string
  campaignName: string
  city: string
  specialtyCode: string
  specialtyLabel: string
  situation: '' | 'A' | 'F'
  state: 'PR'
  maxResults?: number
  sizeRange?: string
  notes?: string
}

export type OabRegistryLead = {
  canonicalName: string
  city: string
  externalId: string
  inscriptionTypeCode: string
  inscriptionTypeLabel: string
  officeName?: string | null
  oabNumber: string
  queryUrl: string
  registryProvider: string
  sourceConfidence: number
  sourceUrl: string
  specialtyCode: string
  specialtyLabel: string
  state: string
  subsection?: string | null
}

export type OabRegistrySearchResult = {
  leads: OabRegistryLead[]
  queryUrl: string
}

export type CnsaRegistrySeed = {
  canonicalName: string
  city?: string
  contactPageUrl?: string
  externalId: string
  notes?: string
  officeName?: string
  registryProvider?: string
  registryTypeLabel?: string
  registryUrl?: string
  sourceUrl: string
  specialtyLabel?: string
  state?: string
  websiteUrl?: string
}

export type CnsaRegistryLead = {
  canonicalName: string
  city: string
  externalId: string
  queryUrl: string
  registryProvider: string
  registryTypeLabel: string
  sourceConfidence: number
  sourceUrl: string
  specialtyLabel: string
  state: string
}

export type OfficialSiteSeed = {
  canonicalName: string
  contactPageUrl?: string
  externalId: string
  notes?: string
  officeName?: string
  sourceUrl: string
  websiteUrl?: string
}

export type OfficialSiteContact = {
  confidence: number
  contactType: 'email' | 'phone' | 'whatsapp'
  isPrimary?: boolean
  label?: string
  sourceUrl: string
  value: string
}

export type OfficialSiteEvidence = {
  sourceUrl: string
  type: string
  value: string
}

export type WebSearchResult = {
  link: string
  snippet: string
  title: string
}

export type WebSearchOrganizationMatch = {
  canonicalName: string
  city?: string | null
  contactPageUrl?: string | null
  externalId: string
  instagramUrl?: string | null
  rawPayloadJson: string
  sourceConfidence: number
  sourceUrl: string
  websiteDomain?: string | null
  websiteUrl?: string | null
}

export type WebSearchSeed = {
  canonicalName: string
  city?: string | null
  externalId: string
  officeName?: string | null
  websiteDomain?: string | null
  websiteUrl?: string | null
}

export type CodexFallbackSeed = {
  canonicalName: string
  city?: string | null
  externalId: string
  officeName?: string | null
  specialtyLabel?: string | null
  state?: string | null
}

export type CodexFallbackMatch = {
  canonicalName: string
  city?: string | null
  contactPageUrl?: string | null
  externalId: string
  instagramUrl?: string | null
  officeName?: string | null
  primaryPhone?: string | null
  primaryWhatsapp?: string | null
  rawPayloadJson: string
  rationale?: string | null
  sourceConfidence: number
  sourceUrl: string
  websiteDomain?: string | null
  websiteUrl?: string | null
}

export type LlmReviewRunRecordInput = {
  model: string
  organizationId?: string | null
  promptText?: string | null
  provider: string
  searchRunId?: number | null
  sessionId: string
  toolName: string
}

export type LlmReviewRunCompletionInput = {
  cachedInputTokens?: number
  estimatedCredits?: number
  finishedAt: string
  inputTokens?: number
  notes?: string | null
  outputTokens?: number
  responseJson?: string | null
  resultFound?: boolean
  status: string
  threadId?: string | null
}

export type CodexUsageSummary = {
  cachedInputTokens: number
  estimatedCredits: number
  inputTokens: number
  outputTokens: number
  resultFoundRuns: number
  runs: number
  sessionId: string | null
}

export type OfficialSiteEnrichment = {
  canonicalName: string
  contactPageUrl?: string | null
  contacts: OfficialSiteContact[]
  evidence: OfficialSiteEvidence[]
  externalId: string
  instagramUrl?: string | null
  officeName?: string | null
  primaryEmail?: string | null
  primaryPhone?: string | null
  primaryWhatsapp?: string | null
  rawPayloadJson: string
  sourceConfidence: number
  sourceTitle?: string | null
  sourceUrl: string
  websiteDomain: string
  websiteUrl: string
  whatsappUrl?: string | null
}

export type CampaignRecordInput = {
  id: string
  name: string
  niche: string
  city: string
  sizeRange?: string
  notes?: string
  status?: string
}

export type EmailCampaignRecordInput = {
  id: string
  leadCampaignId: string
  name: string
  fromEmail: string
  replyToEmail?: string
  timezone?: string
  cadenceMinutes?: number
  plannedStartAt?: string
  notes?: string
  status?: string
}

export type EmailCampaignRow = {
  id: string
  leadCampaignId: string
  name: string
  channel: string
  fromEmail: string
  replyToEmail: string | null
  timezone: string
  cadenceMinutes: number
  plannedStartAt: string | null
  status: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export type EmailJobRecordInput = {
  emailCampaignId: string
  organizationId: string
  sequenceStep?: number
  sourceJobId?: number | null
  toEmail: string
  subject: string
  htmlBody: string
  textBody?: string
  personalizationJson?: string
  scheduledAt?: string | null
  resendEmailId?: string | null
  resendIdempotencyKey?: string | null
  status?: string
  errorMessage?: string | null
}

export type EmailJobRow = {
  id: number
  emailCampaignId: string
  organizationId: string
  sequenceStep: number
  sourceJobId: number | null
  toEmail: string
  subject: string
  htmlBody: string
  textBody: string | null
  personalizationJson: string | null
  scheduledAt: string | null
  resendEmailId: string | null
  resendIdempotencyKey: string | null
  status: string
  errorMessage: string | null
  createdAt: string
  updatedAt: string
}

export type EmailCampaignManifest = {
  emailCampaignId: string
  leadCampaignId: string
  name: string
  fromEmail: string
  replyToEmail?: string
  timezone?: string
  cadenceMinutes?: number
  plannedStartAt?: string
  notes?: string
  subjectTemplate: string
  introLines: string[]
  bodyLines?: string[]
  closingLines?: string[]
  ctaLabel?: string
  ctaUrl?: string
  excludePreviouslyContacted?: boolean
  organizationIds?: string[]
  externalIds?: string[]
  limit?: number
  minBatchSize?: number
  signature: {
    name: string
    role?: string
    phone?: string
    email?: string
    website?: string
  }
}

export type FollowupEmailCampaignManifest = {
  emailCampaignId: string
  baseEmailCampaignId: string
  leadCampaignId: string
  name: string
  fromEmail: string
  replyToEmail?: string
  timezone?: string
  cadenceMinutes?: number
  plannedStartAt?: string
  minimumHoursAfterPreviousEmail: number
  notes?: string
  subjectTemplate: string
  introLines: string[]
  bodyLines?: string[]
  closingLines?: string[]
  ctaLabel?: string
  ctaUrl?: string
  limit?: number
  signature: {
    name: string
    role?: string
    phone?: string
    email?: string
    website?: string
  }
}

export type EmailResponseRecordInput = {
  resendInboundEmailId: string
  emailJobId?: number | null
  emailCampaignId?: string | null
  organizationId?: string | null
  fromEmail: string
  toEmail: string
  subject?: string | null
  receivedAt: string
  rawPayloadJson?: string
}

export type EmailResponseRow = {
  id: number
  resendInboundEmailId: string
  emailJobId: number | null
  emailCampaignId: string | null
  organizationId: string | null
  fromEmail: string
  toEmail: string
  subject: string | null
  receivedAt: string
  rawPayloadJson: string | null
  createdAt: string
}

export type SearchRunRecordInput = {
  campaignId: string
  sourceChannel: string
  toolName: string
  queryText: string
  notes?: string
}

export type ShortlistRow = {
  campaignId: string
  city: string
  externalId: string
  id: string
  instagramUrl: string | null
  manualNumber: string | null
  nextStep: string
  officeName: string | null
  officialSiteTitle: string | null
  officialSiteUrl: string | null
  primaryEmail: string | null
  primaryPhone: string | null
  primaryWhatsapp: string | null
  registryUrl: string
  sourceConfidence: number
  sourceTitle: string | null
  specialtyLabel: string | null
  state: string | null
  status: string
  canonicalName: string
  websiteDomain: string | null
  websiteUrl: string | null
}

export type GeminiEmailSeed = {
  canonicalName: string
  city: string | null
  externalId: string
  instagramUrl: string | null
  officeName: string | null
  organizationId: string
  state: string | null
  websiteUrl: string | null
}
