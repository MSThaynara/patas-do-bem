/* =========================================================
   DATABASE.JS - PATAS DO BEM (COMPLETO)
   Gerencia conexões com o Supabase para Cadastro e Leitura
========================================================= */
const SUPABASE_URL = "https://mnxdxadptxymjsfptbhl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ueGR4YWRwdHh5bWpzZnB0YmhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MjAxMDMsImV4cCI6MjA5NjA5NjEwM30.pXTRVG-HVujHG4fRbyDpM6G23oq0-nC-P2rrnsLA07o";

// FUNÇÃO PARA CADASTRAR
async function cadastrarCao(dados) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/animais`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                nome: dados.nome,
                raca: dados.raca,
                idade: dados.idade,
                porte: dados.porte,
                sexo: dados.sexo,
                descricao: dados.descricao,
                imagem_url: dados.imagem_url,
                castrado: Boolean(dados.castrado),
                vacinado: Boolean(dados.vacinado),
                status_adocao: dados.status_adocao
            })
        });

        if (response.status === 201 || response.status === 200) {
            console.log("Sucesso: Dado enviado ao Supabase!");
            return { sucesso: true }; 
        } else {
            const erroDetalhado = await response.json();
            console.error("Erro real do Supabase:", erroDetalhado);
            throw new Error(erroDetalhado.message || "Erro ao salvar no banco");
        }
    } catch (error) {
        console.error("Erro no database.js:", error);
        throw error;
    }
}

// FUNÇÃO PARA BUSCAR (LISTAR)
async function buscarCaes() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/animais?select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error("Erro ao buscar dados");
        return await response.json();
    } catch (error) {
        console.error("Erro na busca:", error);
        return [];
    }
}