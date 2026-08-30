# Kamalo — Sistema SaaS de Pedidos via WhatsApp

> Plataforma SaaS para negócios onde o cliente monta pedidos com vários itens e finaliza direto pelo WhatsApp, com o valor total sempre visível — eliminando o cancelamento por "susto no preço" que acontece quando o pedido é feito por telefone ou balcão.

---

## O problema que o Kamalo resolve

Em mercadinhos, mercearias, açougues, hamburguerias, pizzarias, autopeças e ferragistas, existe um gargalo silencioso:

1. O cliente monta o pedido ou escolhe os produtos
2. O funcionário separa tudo manualmente
3. O cliente descobre o valor total só no caixa
4. O cliente desiste — e o funcionário precisa repor tudo

Esse ciclo desperdiça tempo do colaborador, ocupa espaço e gera frustração dos dois lados.

**O Kamalo elimina esse gargalo.**

---

## Como funciona

O cliente acessa o sistema, seleciona os produtos com quantidade, visualiza o valor total em tempo real e finaliza o pedido diretamente pelo WhatsApp — com nome, endereço e lista completa já formatados.

O funcionário recebe o pedido pronto, separa apenas o que foi confirmado e aguarda o pagamento.

```
Cliente acessa o sistema
        ↓
Seleciona produtos + quantidade
        ↓
Visualiza valor total
        ↓
Informa nome e endereço
        ↓
Finaliza → WhatsApp da empresa com pedido completo
        ↓
Funcionário separa e confirma entrega
```

---

## Funcionalidades atuais

- Sistema de catálogo organizado por categorias
- Controle de quantidade por item
- Cálculo de total em tempo real
- Checkout com nome e endereço do cliente
- Envio automático do pedido formatado para o WhatsApp do negócio
- Dados de produtos carregados via Supabase (banco de dados em nuvem)
- Validação defensiva de dados vindos do banco (evita quebra do sistema com dados malformados)
- Keep Alive automático via GitHub Actions para manter o banco ativo

---

## Tecnologias utilizadas

| Camada         | Tecnologia            |
| -------------- | --------------------- |
| Frontend       | HTML, CSS, JavaScript |
| Banco de dados | Supabase (PostgreSQL) |
| Hospedagem     | GitHub Pages          |
| Automação      | GitHub Actions        |
| Integração     | WhatsApp API (wa.me)  |

---

## Roadmap — próximas versões

O Kamalo é um sistema SaaS em evolução contínua, construído em etapas. As próximas versões incluem:

- [ ] Painel administrativo para o lojista (cadastro de produtos sem tocar em código)
- [ ] Login e isolamento de dados por loja (multi-tenant)
- [ ] Histórico de pedidos por cliente
- [ ] Notificação de novo pedido em tempo real
- [ ] Integração com Pix e boleto
- [ ] Painel do entregador
- [ ] Rastreio de entrega
- [ ] Integração com Google Maps
- [ ] Painel de relatórios e produtos mais vendidos

---

## Modelo comercial

O Kamalo é um sistema SaaS comercializado pela **NOKAIZ Tecnologia** no modelo de assinatura:

- **Implementação:** configuração inicial, cadastro de produtos e personalização da loja
- **Mensalidade:** manutenção, suporte, infraestrutura e acesso a todas as atualizações da plataforma

Cada cliente opera dentro do mesmo sistema, com sua própria loja, catálogo e link — sem precisar desenvolver ou manter nada por conta própria.

Voltado para negócios locais onde o cliente monta pedidos com vários itens por telefone ou WhatsApp, e quer digitalizar esse atendimento sem depender de aplicativos caros ou complexos.

---

## Demonstração

🔗 [Acessar demonstração ao vivo](https://raikankleberson.github.io/kamalo/)

> A demonstração utiliza produtos fictícios. A implementação para cada cliente é personalizada com os produtos, preços, logo e WhatsApp do próprio negócio.

---

## Contato

Interessado em implementar o Kamalo no seu negócio?

📲 [Falar com a NOKAIZ Tecnologia pelo WhatsApp](https://wa.me/63999665779)

---

Desenvolvido por [Raikan Kleberson](https://github.com/RaikanKleberson) — [NOKAIZ Tecnologia](https://wa.me/63999665779)
