# Guia Completo: Hospedagem com Docker (Ubuntu Server)
> [!NOTE]
> Este é o guia definitivo passo a passo feito para você que não tem experiência com servidores. O Docker fará todo o trabalho pesado por nós!

---

## Passo 1: Enviando a pasta do seu computador para a Máquina Virtual (VM)

A primeira coisa a fazer é pegar todos os arquivos que estão na sua pasta do Windows (`aldebaran-contratos`) e mandar lá para a máquina Ubuntu. Faremos isso para não perdermos o seu banco de dados preenchido.

Você pode fazer isso de duas formas diferentes, escolha a que achar mais fácil:

### Opção A: Pelo Terminal / CMD (Mais Rápido)
Abra um novo terminal PowerShell no seu Windows e digite o seguinte comando (substitua `usuario` e `IP_DA_VM` pelos seus dados):
```powershell
scp -r C:\Users\samue\CPA\aldebaran-contratos usuario@IP_DA_VM:~/aldebaran-contratos
```
*Ele pedirá a senha do servidor Ubuntu. Basta digitar (a senha não aparece na tela por segurança) e apertar Enter. Aguarde a cópia.*

### Opção B: Por um Programa Visual (Mais Intuitivo)
1. Baixe e instale o programa gratuito **WinSCP** (https://winscp.net/).
2. Abra o WinSCP e preencha os dados do servidor:
   - **Hostname:** `Endereço IP da VM` (Exemplo: 192.168.1.50)
   - **Port number:** `22`
   - **User name:** `Seu usuario da VM`
   - **Password:** `Sua senha da VM`
3. Clique em "Login".
4. A tela vai se dividir. O lado esquerdo é o seu Windows, o direito é o Linux.
5. No lado esquerdo, navegue até a pasta `C:\Users\samue\CPA\`.
6. Arraste a pasta `aldebaran-contratos` do lado esquerdo e solte no lado direito.
   > [!TIP]
   > Para ser mais rápido: antes de arrastar, exclua as pastas `node_modules` (que fica dentro do frontend) e a pasta `venv` (que fica dentro do backend) no seu Windows. O Docker não precisará delas.

---

## Passo 2: Acessando a Máquina pelo Terminal (SSH)

Agora que os arquivos estão lá, abra o prompt de comando no Windows ou o PowerShell e digite:
```powershell
ssh usuario@ip_da_vm
```
Vai pedir a sua senha. Digite-a e aperte Enter.

Pronto, você está "dentro" da máquina virtual via linha de código!

---

## Passo 3: Instalando o Docker com Apenas 1 Comando

Cole este comando mágico fornecido pela equipe oficial do Docker e aperte Enter. Ele vai baixar, instalar e configurar o Docker e o Docker Compose sozinhos. Pode demorar 1 ou 2 minutinhos.

```bash
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
```

*(Pode ser que o Linux peça a sua senha de novo. Apenas digite e de Enter).*

---

## Passo 4: Subindo a Aplicação (A Mágica)

Agora só precisamos entrar na pasta que você mandou lá no Passo 1 e mandar o Docker executar os arquivos que eu preparei.

No seu terminal SSH, entre na pasta que acabamos de enviar:
```bash
cd ~/aldebaran-contratos
```

Verifique se você está na pasta certa rodando o comando `ls`. Você deverá ver o arquivo `docker-compose.yml` listado.

Agora rode o último comando:
```bash
sudo docker compose up -d --build
```

O que vai acontecer:
1. Ele vai baixar o Python, as bibliotecas, e preparar o seu backend.
2. Ele vai baixar o Node, empacotar todo o visual, apagar o Node, e preparar o Nginx para hospedar a página.
3. Ele vai fazer a ponte entre os dois e manter o seu `aldebaran.db` salvo.

Esse primeiro download de tudo demora uns 5 minutos. Nas próximas vezes que você rodar esse mesmo comando para atualizar o sistema, demorará menos de 10 segundos!

---

## Tudo Pronto!

Terminou de rodar e apareceram os status em verde (`Started`)? Parabéns! 

Abra o navegador do seu Windows (ou de qualquer computador na mesma rede wifi/cabo do servidor) e simplesmente digite o **Endereço IP da máquina virtual**. O seu sistema vai aparecer funcionando instantaneamente, conectado ao seu banco de dados atual!
