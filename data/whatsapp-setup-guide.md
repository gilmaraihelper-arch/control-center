# 📱 GUIA: WhatsApp Business API - AgenteFlow

## 🎯 Objetivo
Conectar o AgenteFlow à API oficial do WhatsApp para enviar/receber mensagens.

---

## 📋 PASSO 1: Criar Conta Meta Business

### 1.1 Acesse:
**URL:** https://business.facebook.com/

### 1.2 Clique em "Criar Conta"
- Nome da empresa: **AgenteFlow** (ou nome do seu negócio)
- Email: seu email
- Preencha os dados solicitados

### 1.3 Verificação
- Meta pode pedir verificação de documentos (CNPJ)
- Para testes, a conta funciona sem verificação completa

---

## 📋 PASSO 2: Configurar WhatsApp Business API

### 2.1 No Business Manager:
1. Vá em **Configurações** → **Contas do WhatsApp Business**
2. Clique em **Adicionar** → **Criar conta do WhatsApp Business**
3. Dê um nome: **AgenteFlow Bot**

### 2.2 Adicionar Número de Telefone:
1. Clique em **Adicionar número de telefone**
2. Escolha: **Usar número existente**
3. Insira um número de celular válido (vai receber SMS)
4. Complete a verificação por SMS

---

## 📋 PASSO 3: Obter Credenciais

### 3.1 Token de Acesso:
1. Vá em **Ferramentas do sistema** → **Tokens de acesso**
2. Clique em **Adicionar** → **Criar token**
3. Selecione o app "AgenteFlow"
4. Permissões necessárias:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
   - `business_management`
5. Copie o **Token de Acesso** (começa com `EAA...`)

### 3.2 IDs Necessários:
- **Phone Number ID:** Em Configurações → WhatsApp → seu número
- **Business Account ID:** Em Configurações → Informações da empresa

---

## 📋 PASSO 4: Configurar Webhook

### 4.1 URL do Webhook:
```
https://sua-api.com/api/webhooks/whatsapp
```
Para desenvolvimento local, use **ngrok**:
```bash
ngrok http 3000
# Copie a URL HTTPS gerada
```

### 4.2 No Business Manager:
1. Vá em **WhatsApp** → **Configuração da API**
2. Seção **Webhook** → **Editar**
3. URL do callback: `https://sua-url-ngrok.io/api/webhooks/whatsapp`
4. Token de verificação: `agenteflow-webhook-secret`
5. Clique em **Verificar e salvar**

### 4.3 Assinar Eventos:
Assine estes campos:
- ✅ `messages` (receber mensagens)
- ✅ `message_status` (status de entrega/leitura)

---

## 📋 PASSO 5: Configurar .env

```env
# WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID="123456789012345"
WHATSAPP_BUSINESS_ACCOUNT_ID="123456789012345"
WHATSAPP_ACCESS_TOKEN="EAAxxxxxxxxxxxxxxxx"
WHATSAPP_WEBHOOK_VERIFY_TOKEN="agenteflow-webhook-secret"
```

---

## 📋 PASSO 6: Testar Envio de Mensagem

### 6.1 Registrar Número de Teste
Antes de enviar para qualquer número, precisa registrar:

```bash
curl -X POST \
  'https://graph.facebook.com/v18.0/SEU_PHONE_NUMBER_ID/messages' \
  -H 'Authorization: Bearer SEU_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "5511999999999",
    "type": "text",
    "text": { "body": "Teste do AgenteFlow! 🚀" }
  }'
```

### 6.2 Enviar Mensagem de Template (para números não registrados)
Para enviar para qualquer número, use templates aprovados pela Meta.

---

## 📋 PASSO 7: Testar Recebimento

1. Envie uma mensagem para o número do WhatsApp Business
2. Verifique se o webhook recebeu:
   - Check os logs: `tail -f /tmp/comfy.log` (ops, log do comfy)
   - Ou: console do seu backend

---

## ⚠️ Limitações Importantes

### Sandbox (Desenvolvimento):
- Máximo 5 números de teste
- Templates pré-aprovados apenas
- Limite de mensagens/dia

### Produção:
- Precisa de verificação business
- Templates precisam ser aprovados (24-48h)
- Custo por conversa: ~US$0.005-0.08

---

## 🔧 Troubleshooting

### "Número não registrado"
→ Adicione o número na lista de testes primeiro

### "Token inválido"
→ Regenere o token no Business Manager

### "Webhook não verifica"
→ Verifique se a URL está acessível publicamente (use ngrok)

### "Mensagens não chegam"
→ Verifique se assinou o campo `messages` no webhook

---

## 📚 Links Úteis

- [Documentação Oficial](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [WhatsApp Business Manager](https://business.facebook.com/whatsapp-business/)

---

**Próximo passo:** Configurar ngrok e testar o webhook localmente!
