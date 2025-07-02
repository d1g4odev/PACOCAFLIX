# 🖼️ COMO TROCAR O LOGO PARA PAÇOCAFLIX

## 📍 **Localização do arquivo:**
`movies-front/src/assets/images/logo.png`

## 🔄 **Passos para trocar:**

1. **Navegue até a pasta:**
   ```
   C:\Users\Rodrigo\Desktop\CINEAPP\movies-front\src\assets\images\
   ```

2. **Substitua o arquivo:**
   - Delete ou renomeie o `logo.png` atual
   - Copie sua imagem `PAÇOCAFLIX.png` para essa pasta
   - Renomeie para `logo.png`

3. **Ou renomeie no código:**
   Se preferir manter o nome `PAÇOCAFLIX.png`, altere o arquivo:
   `movies-front/src/app/public/login/login.component.html`
   
   Linha 7: Mude de:
   ```html
   <img src="assets/images/logo.png" class="margin-title" alt="">
   ```
   
   Para:
   ```html
   <img src="assets/images/PAÇOCAFLIX.png" class="margin-title" alt="">
   ```

## ✅ **Resultado:**
- Logo será exibido na tela de login
- Título da aba será "PAÇOCAFLIX"

## 🚀 **Após trocar:**
Recarregue a página (F5) para ver a mudança! 