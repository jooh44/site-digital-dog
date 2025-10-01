<?php
/**
 * Meta Conversions API - Backend Endpoint
 * Este arquivo deve ser hospedado no seu servidor para enviar eventos server-side
 */

// Configurações de CORS (ajuste conforme necessário)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Em produção, especifique o domínio
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Responde a requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Só aceita POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Configurações da Meta Conversions API
$CONFIG = [
    'ACCESS_TOKEN' => 'EAAbVUZAbBkLMBPonj80w3b4cTsxL4Sv5nzPuVBRZAHQZB4cxavxKSqAa6STiqa7SAfDNgQJBkeOpWXfkcQ3LdUWnRvp5B9CLMG5bXwEfsIZB3tauLUD3qkLi76aN3TSlJzABlVPty8R5qAufbP52J22cSGOCTrm5yYgP8fqHiBGqSWMX29Uk239M4KjSAQZDZD',
    'API_VERSION' => 'v18.0',
    'PIXEL_ID' => '801300356407188'
];

try {
    // Lê o payload JSON
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        throw new Exception('Invalid JSON payload');
    }
    
    $pixelId = $data['pixelId'] ?? $CONFIG['PIXEL_ID'];
    $payload = $data['payload'] ?? [];
    
    // Adiciona o IP real do cliente
    $clientIP = getClientIP();
    
    // Processa cada evento no payload
    if (isset($payload['data']) && is_array($payload['data'])) {
        foreach ($payload['data'] as &$event) {
            if (isset($event['user_data'])) {
                // Substitui o placeholder pelo IP real
                if (isset($event['user_data']['client_ip_address']) && 
                    $event['user_data']['client_ip_address'] === '{{client_ip_address}}') {
                    $event['user_data']['client_ip_address'] = $clientIP;
                }
                
                // Hash dos dados pessoais conforme exigido pela Meta
                $event['user_data'] = hashUserData($event['user_data']);
            }
        }
    }
    
    // Envia para a Meta Conversions API
    $response = sendToMeta($pixelId, $payload, $CONFIG['ACCESS_TOKEN'], $CONFIG['API_VERSION']);
    
    // Log para debug (remover em produção)
    logEvent($pixelId, $payload, $response);
    
    // Retorna resposta
    echo json_encode([
        'success' => true,
        'message' => 'Event sent successfully',
        'meta_response' => $response
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

/**
 * Obtém o IP real do cliente
 */
function getClientIP() {
    $headers = [
        'HTTP_CF_CONNECTING_IP',     // Cloudflare
        'HTTP_CLIENT_IP',            // Proxy
        'HTTP_X_FORWARDED_FOR',      // Load Balancer/Proxy
        'HTTP_X_FORWARDED',          // Proxy
        'HTTP_X_CLUSTER_CLIENT_IP',  // Cluster
        'HTTP_FORWARDED_FOR',        // Proxy
        'HTTP_FORWARDED',            // Proxy
        'REMOTE_ADDR'                // Padrão
    ];
    
    foreach ($headers as $header) {
        if (!empty($_SERVER[$header])) {
            $ip = $_SERVER[$header];
            // Se múltiplos IPs, pega o primeiro
            if (strpos($ip, ',') !== false) {
                $ip = trim(explode(',', $ip)[0]);
            }
            // Valida se é um IP válido
            if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                return $ip;
            }
        }
    }
    
    return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
}

/**
 * Faz hash dos dados do usuário conforme exigido pela Meta
 */
function hashUserData($userData) {
    $fieldsToHash = ['email', 'phone', 'first_name', 'last_name', 'city', 'state', 'zip', 'country'];
    
    foreach ($fieldsToHash as $field) {
        if (isset($userData[$field]) && !empty($userData[$field])) {
            $userData[$field] = hash('sha256', strtolower(trim($userData[$field])));
        }
    }
    
    return $userData;
}

/**
 * Envia dados para a Meta Conversions API
 */
function sendToMeta($pixelId, $payload, $accessToken, $apiVersion) {
    $url = "https://graph.facebook.com/{$apiVersion}/{$pixelId}/events";
    
    $postData = array_merge($payload, [
        'access_token' => $accessToken
    ]);
    
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($postData),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_USERAGENT => 'DigitalDog-MetaAPI/1.0'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if (curl_errno($ch)) {
        curl_close($ch);
        throw new Exception('cURL Error: ' . curl_error($ch));
    }
    
    curl_close($ch);
    
    $decodedResponse = json_decode($response, true);
    
    if ($httpCode !== 200) {
        $errorMsg = isset($decodedResponse['error']['message']) 
            ? $decodedResponse['error']['message'] 
            : 'Unknown error';
        throw new Exception("Meta API Error (HTTP {$httpCode}): {$errorMsg}");
    }
    
    return $decodedResponse;
}

/**
 * Log dos eventos para debug (remover em produção)
 */
function logEvent($pixelId, $payload, $response) {
    $logFile = __DIR__ . '/meta-conversions.log';
    $logEntry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'pixel_id' => $pixelId,
        'events_count' => count($payload['data'] ?? []),
        'response' => $response,
        'client_ip' => getClientIP()
    ];
    
    file_put_contents($logFile, json_encode($logEntry) . "\n", FILE_APPEND | LOCK_EX);
}
?>