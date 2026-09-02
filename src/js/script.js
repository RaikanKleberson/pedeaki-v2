/* =========================================================
   KAMALO SISTEMA
   CATÁLOGO DE PRODUTOS + SUPABASE
   ========================================================= */


/* =========================================================
   CONFIGURAÇÃO SUPABASE
   ========================================================= */

const SUPABASE_URL =
  "https://chjtvpgjosbgqmzwrkco.supabase.co";

/*
  Chave ANON pública do seu projeto.

  NÃO colocar a sb_secret aqui.
*/
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoanR2cGdqb3NiZ3Ftendya2NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNTE1MTMsImV4cCI6MjEwMzkyNzUxM30.Km8Tp0kiccBaUEGUB98fh0bS8DaSFrwkw9OG7O1X6a4";


/* =========================================================
   CRIAR CLIENTE SUPABASE
   ========================================================= */

const clienteSupabase =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


/* =========================================================
   CONFIGURAÇÕES
   ========================================================= */

const CHAVE_CARRINHO =
  "carrinho_kamalo";

const WHATSAPP =
  "5563999665779";

const CATEGORIAS = [
  "acai",
  "combos",
  "sorvetes",
  "sucosnaturais",
  "bebidas"
];

let produtos = [];

let carrinho = carregarCarrinho();


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  async function () {

    console.log(
      "===================================="
    );

    console.log(
      "KAMALO - INICIANDO SISTEMA"
    );

    console.log(
      "Supabase:",
      SUPABASE_URL
    );

    console.log(
      "===================================="
    );


    configurarCategorias();

    iniciarCarrossel();

    atualizarCarrinho();

    await carregarProdutos();

  }
);


/* =========================================================
   TESTAR CONEXÃO SUPABASE
   ========================================================= */

async function testarSupabase() {

  console.log(
    "Testando conexão com Supabase..."
  );


  try {

    const {
      data,
      error
    } = await clienteSupabase
      .from("produtos")
      .select("id")
      .limit(1);


    if (error) {

      console.error(
        "ERRO SUPABASE:",
        error
      );

      mostrarErroSupabase(error);

      return false;

    }


    console.log(
      "SUPABASE CONECTADO COM SUCESSO!"
    );

    console.log(
      "Teste retornou:",
      data
    );


    return true;


  } catch (erro) {

    console.error(
      "ERRO DE CONEXÃO:",
      erro
    );

    mostrarErroSupabase(
      erro
    );

    return false;

  }

}


/* =========================================================
   CARREGAR PRODUTOS
   ========================================================= */

async function carregarProdutos() {

  mostrarCarregando();


  console.log(
    "Buscando produtos da tabela 'produtos'..."
  );


  try {

    const {
      data,
      error
    } = await clienteSupabase

      .from("produtos")

      .select(
        "id, nome, preco, categoria, foto_url"
      )

      .order(
        "id",
        {
          ascending: true
        }
      );


    /* =====================================================
       TRATAMENTO DE ERRO
       ===================================================== */

    if (error) {

      console.error(
        "===================================="
      );

      console.error(
        "ERRO AO BUSCAR PRODUTOS"
      );

      console.error(
        error
      );

      console.error(
        "Mensagem:",
        error.message
      );

      console.error(
        "Detalhes:",
        error.details
      );

      console.error(
        "Hint:",
        error.hint
      );

      console.error(
        "Código:",
        error.code
      );

      console.error(
        "===================================="
      );


      mostrarErroSupabase(
        error
      );

      return;

    }


    /* =====================================================
       RESULTADO
       ===================================================== */

    console.log(
      "Produtos recebidos do Supabase:",
      data
    );


    produtos = (data || [])

      .map(
        normalizarProduto
      )

      .filter(
        produto =>
          CATEGORIAS.includes(
            produto.categoria
          )
      );


    console.log(
      "Produtos válidos:",
      produtos
    );


    console.log(
      "Quantidade:",
      produtos.length
    );


    /* =====================================================
       RENDERIZAR
       ===================================================== */

    renderizarProdutos();

    atualizarCarrinho();


    /* =====================================================
       MOSTRAR PRIMEIRA CATEGORIA
       ===================================================== */

    if (
      produtos.length > 0
    ) {

      mostrarCategoria(
        CATEGORIAS[0],
        false
      );

    } else {

      console.warn(
        "Nenhum produto encontrado."
      );

      mostrarMensagemNenhumProduto();

    }


  } catch (erro) {

    console.error(
      "Erro inesperado:",
      erro
    );

    mostrarErroSupabase(
      erro
    );

  }

}


/* =========================================================
   NORMALIZAR PRODUTO
   ========================================================= */

function normalizarProduto(
  produto
) {

  return {

    id:
      produto.id,

    nome:
      String(
        produto.nome || "Produto"
      ),

    preco:
      Number(
        produto.preco
      ) || 0,

    categoria:
      normalizarCategoria(
        produto.categoria
      ),

    imagem:
      produto.foto_url ||
      "src/images/produto-padrao.png"

  };

}


/* =========================================================
   NORMALIZAR CATEGORIA
   ========================================================= */

function normalizarCategoria(
  categoria
) {

  const valor =
    String(
      categoria || ""
    )

      .trim()

      .toLowerCase()

      .normalize(
        "NFD"
      )

      .replace(
        /[\u0300-\u036f]/g,
        ""
      );


  const mapa = {

    acai:
      "acai",

    acais:
      "acai",

    combo:
      "combos",

    combos:
      "combos",

    sorvete:
      "sorvetes",

    sorvetes:
      "sorvetes",

    suco:
      "sucosnaturais",

    sucos:
      "sucosnaturais",

    "suco natural":
      "sucosnaturais",

    "sucos naturais":
      "sucosnaturais",

    sucosnatural:
      "sucosnaturais",

    sucosnaturais:
      "sucosnaturais",

    bebida:
      "bebidas",

    bebidas:
      "bebidas"

  };


  return (
    mapa[valor] ||
    valor
  );

}


/* =========================================================
   RENDERIZAR PRODUTOS
   ========================================================= */

function renderizarProdutos() {

  CATEGORIAS.forEach(
    categoria => {

      const container =
        document.getElementById(
          `${categoria}-produtos`
        );


      if (!container) {

        console.warn(
          `Container não encontrado: ${categoria}-produtos`
        );

        return;

      }


      const lista =
        produtos.filter(
          produto =>
            produto.categoria ===
            categoria
        );


      if (
        lista.length === 0
      ) {

        container.innerHTML = `

          <div
            style="
              grid-column:1/-1;
              padding:30px;
              text-align:center;
            "
          >
            Nenhum produto nesta categoria.
          </div>

        `;

        return;

      }


      container.innerHTML =
        lista

          .map(
            criarCardProduto
          )

          .join("");

    }
  );


  produtos.forEach(
    produto => {

      atualizarQuantidadeProduto(
        produto.id
      );

    }
  );

}


/* =========================================================
   CARD PRODUTO
   ========================================================= */

function criarCardProduto(
  produto
) {

  const quantidade =
    obterQuantidade(
      produto.id
    );


  return `

    <article
      class="produto-card"
      data-produto-id="${produto.id}"
    >

      <div class="produto-imagem-container">

        <img

          class="produto-imagem"

          src="${escaparHTML(
            produto.imagem
          )}"

          alt="${escaparHTML(
            produto.nome
          )}"

          loading="lazy"

          onerror="
            this.onerror=null;
            this.src='src/images/produto-padrao.png';
          "

        />

      </div>


      <div class="produto-info">

        <h3 class="produto-nome">

          ${escaparHTML(
            produto.nome
          )}

        </h3>


        <p class="produto-preco">

          ${formatarPreco(
            produto.preco
          )}

        </p>


        <div class="controles">

          <button
            type="button"
            class="btn-quantidade"
            onclick="diminuir(${produto.id})"
          >
            −
          </button>


          <span
            class="quantidade-produto"
            id="quantidade-produto-${produto.id}"
          >
            ${quantidade}
          </span>


          <button
            type="button"
            class="btn-quantidade"
            onclick="aumentar(${produto.id})"
          >
            +
          </button>

        </div>

      </div>

    </article>

  `;

}


/* =========================================================
   MOSTRAR CARREGANDO
   ========================================================= */

function mostrarCarregando() {

  CATEGORIAS.forEach(
    categoria => {

      const container =
        document.getElementById(
          `${categoria}-produtos`
        );


      if (!container) {
        return;
      }


      container.innerHTML = `

        <div
          style="
            grid-column:1/-1;
            text-align:center;
            padding:50px 20px;
          "
        >

          <div
            style="
              font-size:18px;
              font-weight:600;
            "
          >

            Carregando produtos...

          </div>

        </div>

      `;

    }
  );

}


/* =========================================================
   MOSTRAR ERRO SUPABASE
   ========================================================= */

function mostrarErroSupabase(
  error
) {

  const mensagem =
    error?.message ||
    "Erro desconhecido";


  CATEGORIAS.forEach(
    categoria => {

      const container =
        document.getElementById(
          `${categoria}-produtos`
        );


      if (!container) {
        return;
      }


      container.innerHTML = `

        <div
          style="
            grid-column:1/-1;
            margin:20px 0;
            padding:25px;
            border-radius:12px;
            background:#fff;
            border:2px solid #e74c3c;
          "
        >

          <strong>
            Erro ao carregar produtos
          </strong>

          <p
            style="
              margin-top:10px;
              font-size:14px;
            "
          >
            ${escaparHTML(
              mensagem
            )}
          </p>

          <p
            style="
              margin-top:10px;
              font-size:13px;
            "
          >
            Abra o Console do navegador
            (F12) para ver os detalhes.
          </p>

        </div>

      `;

    }
  );

}


/* =========================================================
   NENHUM PRODUTO
   ========================================================= */

function mostrarMensagemNenhumProduto() {

  CATEGORIAS.forEach(
    categoria => {

      const container =
        document.getElementById(
          `${categoria}-produtos`
        );


      if (!container) {
        return;
      }


      container.innerHTML = `

        <div
          style="
            grid-column:1/-1;
            text-align:center;
            padding:40px 20px;
          "
        >

          Nenhum produto encontrado.

        </div>

      `;

    }
  );

}


/* =========================================================
   FORMATAR PREÇO
   ========================================================= */

function formatarPreco(
  valor
) {

  return Number(
    valor || 0
  ).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL"
    }
  );

}


/* =========================================================
   ESCAPAR HTML
   ========================================================= */

function escaparHTML(
  valor
) {

  return String(
    valor ?? ""
  )

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


/* =========================================================
   CARRINHO
   ========================================================= */

function carregarCarrinho() {

  try {

    const salvo =
      localStorage.getItem(
        CHAVE_CARRINHO
      );


    if (!salvo) {

      return [];

    }


    const dados =
      JSON.parse(
        salvo
      );


    return Array.isArray(
      dados
    )
      ? dados
      : [];


  } catch (erro) {

    console.error(
      "Erro ao carregar carrinho:",
      erro
    );

    return [];

  }

}


/* =========================================================
   SALVAR CARRINHO
   ========================================================= */

function salvarCarrinho() {

  localStorage.setItem(
    CHAVE_CARRINHO,
    JSON.stringify(
      carrinho
    )
  );

}


/* =========================================================
   BUSCAR QUANTIDADE
   ========================================================= */

function obterQuantidade(
  id
) {

  const item =
    carrinho.find(
      item =>
        String(
          item.id
        ) ===
        String(
          id
        )
    );


  return item
    ? Number(
        item.quantidade
      )
    : 0;

}


/* =========================================================
   BUSCAR PRODUTO
   ========================================================= */

function buscarProduto(
  id
) {

  return produtos.find(
    produto =>
      String(
        produto.id
      ) ===
      String(
        id
      )
  );

}


/* =========================================================
   AUMENTAR
   ========================================================= */

function aumentar(
  id
) {

  const produto =
    buscarProduto(
      id
    );


  if (!produto) {

    console.error(
      "Produto não encontrado:",
      id
    );

    return;

  }


  const item =
    carrinho.find(
      item =>
        String(
          item.id
        ) ===
        String(
          id
        )
    );


  if (item) {

    item.quantidade++;

  } else {

    carrinho.push({

      id:
        produto.id,

      nome:
        produto.nome,

      preco:
        produto.preco,

      categoria:
        produto.categoria,

      imagem:
        produto.imagem,

      quantidade:
        1

    });

  }


  salvarCarrinho();

  atualizarCarrinho();

}


/* =========================================================
   DIMINUIR
   ========================================================= */

function diminuir(
  id
) {

  const index =
    carrinho.findIndex(
      item =>
        String(
          item.id
        ) ===
        String(
          id
        )
    );


  if (index === -1) {
    return;
  }


  carrinho[index].quantidade--;


  if (
    carrinho[index].quantidade <= 0
  ) {

    carrinho.splice(
      index,
      1
    );

  }


  salvarCarrinho();

  atualizarCarrinho();

}


/* =========================================================
   REMOVER ITEM
   ========================================================= */

function removerItem(
  id
) {

  carrinho =
    carrinho.filter(
      item =>
        String(
          item.id
        ) !==
        String(
          id
        )
    );


  salvarCarrinho();

  atualizarCarrinho();

}


/* =========================================================
   ATUALIZAR CARRINHO
   ========================================================= */

function atualizarCarrinho() {

  const lista =
    document.getElementById(
      "lista-produtos"
    );


  const totalElemento =
    document.getElementById(
      "total-pedido"
    );


  const contador =
    document.getElementById(
      "carrinho-contador"
    );


  if (!lista) {
    return;
  }


  /* CARRINHO VAZIO */

  if (
    carrinho.length === 0
  ) {

    lista.innerHTML = `

      <p class="carrinho-vazio">

        🛒 Seu carrinho está vazio

      </p>

    `;

  } else {

    lista.innerHTML =

      carrinho

        .map(
          item => {

            const subtotal =
              Number(
                item.preco
              ) *
              Number(
                item.quantidade
              );


            return `

              <div
                class="carrinho-item"
              >

                <div
                  class="carrinho-item-info"
                >

                  <strong>
                    ${escaparHTML(
                      item.nome
                    )}
                  </strong>

                  <span>
                    ${item.quantidade}x
                    ${formatarPreco(
                      item.preco
                    )}
                  </span>

                </div>


                <div
                  class="carrinho-item-acoes"
                >

                  <strong>

                    ${formatarPreco(
                      subtotal
                    )}

                  </strong>


                  <button
                    type="button"
                    class="btn-remover"
                    onclick="removerItem(${item.id})"
                  >

                    <i
                      class="fas fa-trash"
                    ></i>

                  </button>

                </div>

              </div>

            `;

          }
        )

        .join("");

  }


  /* TOTAL */

  if (totalElemento) {

    totalElemento.textContent =
      formatarPreco(
        calcularTotal()
      );

  }


  /* CONTADOR */

  if (contador) {

    contador.textContent =
      calcularQuantidadeTotal();

  }


  /* QUANTIDADES */

  produtos.forEach(
    produto => {

      atualizarQuantidadeProduto(
        produto.id
      );

    }
  );

}


/* =========================================================
   TOTAL
   ========================================================= */

function calcularTotal() {

  return carrinho.reduce(
    (
      total,
      item
    ) => {

      return (

        total +

        Number(
          item.preco || 0
        ) *

        Number(
          item.quantidade || 0
        )

      );

    },
    0
  );

}


/* =========================================================
   QUANTIDADE TOTAL
   ========================================================= */

function calcularQuantidadeTotal() {

  return carrinho.reduce(
    (
      total,
      item
    ) => {

      return (

        total +

        Number(
          item.quantidade || 0
        )

      );

    },
    0
  );

}


/* =========================================================
   ATUALIZAR QUANTIDADE NO CARD
   ========================================================= */

function atualizarQuantidadeProduto(
  id
) {

  const elemento =
    document.getElementById(
      `quantidade-produto-${id}`
    );


  if (elemento) {

    elemento.textContent =
      obterQuantidade(
        id
      );

  }

}


/* =========================================================
   MOSTRAR CATEGORIA
   ========================================================= */

function mostrarCategoria(
  categoria,
  rolar = true
) {

  const categoriaNormalizada =
    normalizarCategoria(
      categoria
    );


  document
    .querySelectorAll(
      ".categoria"
    )
    .forEach(
      secao => {

        secao.style.display =
          "none";

      }
    );


  const secao =
    document.getElementById(
      categoriaNormalizada
    );


  if (secao) {

    secao.style.display =
      "block";

  }


  document
    .querySelectorAll(
      ".menu-categorias a[data-categoria]"
    )
    .forEach(
      link => {

        link.classList.toggle(

          "active",

          normalizarCategoria(
            link.dataset.categoria
          ) ===
          categoriaNormalizada

        );

      }
    );


  if (
    rolar &&
    secao
  ) {

    const menu =
      document.getElementById(
        "menu-categorias"
      );


    const alturaMenu =
      menu
        ? menu.offsetHeight
        : 0;


    window.scrollTo({

      top:

        secao.getBoundingClientRect().top +

        window.scrollY -

        alturaMenu -

        10,

      behavior:
        "smooth"

    });

  }

}


/* =========================================================
   CONFIGURAR MENU
   ========================================================= */

function configurarCategorias() {

  document
    .querySelectorAll(
      ".menu-categorias a[data-categoria]"
    )
    .forEach(
      link => {

        link.addEventListener(
          "click",
          function (evento) {

            evento.preventDefault();

            mostrarCategoria(
              link.dataset.categoria
            );

          }
        );

      }
    );

}


/* =========================================================
   ABRIR CARRINHO
   ========================================================= */

function abrirCarrinho() {

  const carrinhoElemento =
    document.querySelector(
      ".carrinho"
    );


  if (
    carrinhoElemento
  ) {

    carrinhoElemento.scrollIntoView({

      behavior:
        "smooth",

      block:
        "start"

    });

  }

}


/* =========================================================
   FINALIZAR PEDIDO
   ========================================================= */

function finalizarPedido() {

  if (
    carrinho.length === 0
  ) {

    alert(
      "Seu carrinho está vazio."
    );

    return;

  }


  const nome =
    document
      .getElementById(
        "nome-cliente"
      )
      ?.value
      .trim();


  const endereco =
    document
      .getElementById(
        "endereco-cliente"
      )
      ?.value
      .trim();


  const observacao =
    document
      .getElementById(
        "observacao-cliente"
      )
      ?.value
      .trim();


  if (!nome) {

    alert(
      "Digite seu nome completo."
    );

    return;

  }


  if (!endereco) {

    alert(
      "Digite seu endereço."
    );

    return;

  }


  let mensagem =
    "*NOVO PEDIDO - KAMALO*\n\n";


  mensagem +=
    `*Cliente:* ${nome}\n`;

  mensagem +=
    `*Endereço:* ${endereco}\n`;


  if (observacao) {

    mensagem +=
      `*Observação:* ${observacao}\n`;

  }


  mensagem +=
    "\n*PEDIDO:*\n";


  carrinho.forEach(
    item => {

      const subtotal =

        Number(
          item.preco
        ) *

        Number(
          item.quantidade
        );


      mensagem +=

        `${item.quantidade}x ${item.nome} - ${formatarPreco(
          subtotal
        )}\n`;

    }
  );


  mensagem +=

    `\n*TOTAL: ${formatarPreco(
      calcularTotal()
    )}*`;


  const url =

    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
      mensagem
    )}`;


  window.open(
    url,
    "_blank"
  );

}


/* =========================================================
   CARROSSEL DOS BANNERS
   ========================================================= */

function iniciarCarrossel() {

  const slides = Array.from(
    document.querySelectorAll(".carousel .slide")
  );

  if (slides.length === 0) {
    console.warn("Nenhum banner encontrado.");
    return;
  }

  let atual = 0;

  /* Remove active de todos */
  slides.forEach((slide) => {
    slide.classList.remove("active");
  });

  /* Mostra o primeiro */
  slides[0].classList.add("active");

  /* Se tiver apenas um banner, encerra */
  if (slides.length === 1) {
    return;
  }

  /* Troca os banners a cada 4 segundos */
  setInterval(() => {

    slides[atual].classList.remove("active");

    atual++;

    if (atual >= slides.length) {
      atual = 0;
    }

    slides[atual].classList.add("active");

  }, 4000);

}


/* =========================================================
   DISPONIBILIZAR FUNÇÕES PARA O HTML
   ========================================================= */

window.aumentar =
  aumentar;

window.diminuir =
  diminuir;

window.removerItem =
  removerItem;

window.abrirCarrinho =
  abrirCarrinho;

window.finalizarPedido =
  finalizarPedido;

window.mostrarCategoria =
  mostrarCategoria;

window.atualizarCarrinho =
  atualizarCarrinho;