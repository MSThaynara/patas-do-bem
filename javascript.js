/* =========================================================
   JAVASCRIPT.JS - PATAS DO BEM
   Versão Consolidada: Cadastro + Listagem + Filtro Adoção
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LÓGICA DO FORMULÁRIO DE CADASTRO ---
    const form = document.getElementById('form-cadastro-cao');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const arquivo = document.getElementById('foto-cao').files[0];

            if (!arquivo) return alert("Por favor, selecione uma foto!");
            btn.innerText = "Enviando..."; btn.disabled = true;

            try {
                const nomeArquivo = `${Date.now()}_${arquivo.name}`;
                const uploadUrl = `https://mnxdxadptxymjsfptbhl.supabase.co/storage/v1/object/fotos-caes/${nomeArquivo}`;
                
                const responseUpload = await fetch(uploadUrl, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${SUPABASE_KEY}`, 'apikey': SUPABASE_KEY, 'Content-Type': arquivo.type },
                    body: arquivo
                });

                if (!responseUpload.ok) throw new Error("Erro no upload da imagem.");

                const dados = {
                    nome: document.getElementById('nome-cao').value,
                    raca: document.getElementById('raca-cao').value,
                    idade: document.getElementById('idade-cao').value,
                    porte: document.getElementById('porte-cao').value,
                    sexo: document.getElementById('sexo-cao').value,
                    descricao: document.getElementById('desc-cao').value,
                    imagem_url: `https://mnxdxadptxymjsfptbhl.supabase.co/storage/v1/object/public/fotos-caes/${nomeArquivo}`,
                    castrado: document.getElementById('castrado-cao').checked,
                    vacinado: document.getElementById('vacinado-cao').checked,
                    status_adocao: document.getElementById('status-cao').value
                };

                await cadastrarCao(dados);
                alert("Cão cadastrado com sucesso!");
                form.reset();
            } catch (err) { alert("Erro ao cadastrar: " + err.message); } 
            finally { btn.innerText = "Concluir Cadastro"; btn.disabled = false; }
        });
    }

    // --- 2. LÓGICA DE LISTAGEM (Página Cães E Página Adoção) ---
    const dogsGrid = document.getElementById('dogsGrid');         // ID em caes.html
    const adoptionGrid = document.getElementById('adoptionGrid'); // ID em adocao.html
    
    async function carregarDados() {
        try {
            const caes = await buscarCaes(); // Certifique-se de que esta função existe no database.js
            
            // Renderização na página de Cães
            if (dogsGrid) {
                dogsGrid.innerHTML = caes.map(c => `
                    <div class="dog-card">
                        <div class="dog-img"><img src="${c.imagem_url}" alt="${c.nome}" loading="lazy"/></div>
                        <div class="dog-body">
                            <div class="dog-header"><h3>${c.nome}</h3><span class="status-badge">${c.status_adocao}</span></div>
                            <div class="dog-meta">
                                <span>🐾 ${c.sexo || 'N/A'}</span> <span>📅 ${c.idade || '0'} anos</span>
                                <span>${c.castrado ? '🏥 Castrado' : ''}</span> <span>${c.vacinado ? '💉 Vacinado' : ''}</span>
                            </div>
                            <p>${c.descricao || 'Sem descrição'}</p>
                        </div>
                    </div>
                `).join('');
            }

            // Renderização na página de Adoção (apenas status 'adocao')
            if (adoptionGrid) {
                const adocao = caes.filter(c => c.status_adocao === 'adocao');
                if (adocao.length === 0) {
                    adoptionGrid.innerHTML = '<p>Nenhum animal disponível para adoção no momento.</p>';
                } else {
                    adoptionGrid.innerHTML = adocao.map(c => `
                        <div class="adopt-card">
                            <div class="adopt-img"><img src="${c.imagem_url}" alt="${c.nome}"/><span class="adopt-ribbon">Disponível</span></div>
                            <div class="adopt-body">
                                <h3 class="adopt-name">${c.nome}</h3>
                                <div class="adopt-info">
                                    <span>🐾 ${c.idade} anos · ${c.sexo}</span>
                                    <span>${c.vacinado ? '✅ Vacinado' : ''} ${c.castrado ? '· ✅ Castrado' : ''}</span>
                                </div>
                                <button class="btn btn-orange" style="width:100%" onclick="alert('Interesse registrado para ${c.nome}')">Tenho Interesse</button>
                            </div>
                        </div>
                    `).join('');
                }
            }
        } catch (error) { console.error("Erro ao carregar dados:", error); }
    }

    if (dogsGrid || adoptionGrid) carregarDados();

    // --- 3. MENU MOBILE ---
    const navToggle = document.getElementById('navToggle');
    const navMobile = document.getElementById('navMobile');
    if (navToggle) navToggle.addEventListener('click', () => { navMobile.classList.toggle('active'); });
});