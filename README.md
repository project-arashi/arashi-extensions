# Arashi Extensions

# Recurso
##### Funções para fazer web scraping em sites de scans.
- Home - Busca todos os projetos que esteja na home, separando em lançamentos e populares.
- Detalhes - Busca as informações extras de um projeto (ex:Sinopse, Status, autor etc...).
- Capitulos - Busca todos os capitulos.
- Paginas - Busca todas as paginas de um capitulo.
- Buscar - Busca projetos que contenham o termo especificado.
- Buscar por gênero - Busca projetos que tenha o genero especificado.

**Buscar** e **Buscar por gênero** são funções opcionais.

# Exemplo de Aplicação

Usando a extensão da Momo no Hana Scans do **Arashi**, você pode buscar todos os projetos que estejam na home, separando em lançamentos e populares para criar um Aplicativo:

[![Home de um Aplicativo](https://camo.githubusercontent.com/84b528fb13db475b385735b169a500e01845c5e72ef9953ab345c61ab3e5cdee/68747470733a2f2f6d656469612e646973636f72646170702e6e65742f6174746163686d656e74732f3737303436323933353036363836393737322f3935323235353733333930313137323832362f53637265656e73686f745f32303232303331322d3133323334375f4578706f5f476f2e6a70673f77696474683d323236266865696768743d343737)](https://github.com/project-arashi/arashi-ex-app)

# Desenvolver
#### instalação de dependencias
```bash
$ yarn
ou
$ npm install
```

#### Exemplo

```bash
$ git clone https://github.com/project-arashi/arashi-extensions.git
$ cd arashi-extensions
$ yarn 
```

# Extensões
| Scan | Home | Detalhes | Capitulos | Paginas | Buscar por gênero | Buscar | 
| ---- | ---- | -------- | ----- | --------- | ----------------- | ------- |
| [AMA Scans](https://amascan.com/) | ✔️ | ✔️ ️| ✔️ | ✔️ | ✔️ | ❌
| [Momo No Hana Scan](https://www.momonohanascan.com/) | ✔️ | ✔️ ️| ✔️ | ✔️ | ✔️ | ✔️
| [Tao Sect](https://taosect.com/) | ❌ | ❌ ️| ❌ | ❌ | ❌ | ❌