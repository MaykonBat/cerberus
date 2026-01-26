export enum Status { 
    NEW = 1, //cadastro novo mas ainda não ativo
    BLOCKED = 2, //cadastro ativo porém com pagamento pendente
    BANNED = 3, //banido por não ter pago ou qqr outro motivo... não consegue logar
    ACTIVE = 4 //cadastro ativo e em dia nos pagamentos
}