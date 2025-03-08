// Variável para controlar o status de autenticação do administrador
let isAdminAuthenticated = false;
// Objeto para armazenar as edições salvas
let savedContent = {};
// Objeto para armazenar os arquivos enviados
let uploadedFiles = {};
// Array para armazenar itens da galeria
let galleryItems = [];
// Array para armazenar documentos
let documents = [];

// Função para autenticar o administrador
function loginAdmin() {
  const password = document.getElementById('admin-password').value;
  const adminPassword = "admin123"; // Senha fixa para simulação
  
  if (password === adminPassword) {
    isAdminAuthenticated = true;
    document.querySelectorAll('.admin-only').forEach(el => {
      el.style.display = 'inline-block';
    });
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('logout-button').style.display = 'inline-block';
    alert("Sessão iniciada com sucesso!");
  } else {
    alert("Senha incorreta. Tente novamente.");
  }
}

// Função para logout do administrador
function logoutAdmin() {
  isAdminAuthenticated = false;
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = 'none';
  });
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('logout-button').style.display = 'none';
  document.getElementById('admin-password').value = '';
  alert("Sessão encerrada.");
}

// Função para alternar entre abas
function openTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = 'none';
  });
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(tabId).style.display = 'block';
  document.querySelector(`button[onclick="openTab('${tabId}')"]`).classList.add('active');
}

// Função para alternar o modo de edição em seções
function toggleEditSection(sectionId) {
  if (!isAdminAuthenticated) {
    alert("Você precisa estar logado como administrador para editar.");
    return;
  }
  const section = document.getElementById(sectionId);
  const contentDiv = section.querySelector('.content');
  const button = section.querySelector('.admin-only button');
  
  if (contentDiv.contentEditable === "true") {
    contentDiv.contentEditable = "false";
    button.textContent = "Editar";
    savedContent[sectionId] = contentDiv.innerHTML; // Salva as alterações
    alert("Alterações salvas com sucesso!");
  } else {
    contentDiv.contentEditable = "true";
    button.textContent = "Salvar";
  }
}

// Função para adicionar novo item em seções do tipo lista
function adicionarNovoItem(sectionId) {
  if (!isAdminAuthenticated) {
    alert("Você precisa estar logado como administrador para adicionar itens.");
    return;
  }
  const section = document.getElementById(sectionId);
  const contentDiv = section.querySelector('.content');
  const novoItem = prompt("Digite a nova informação:");
  if (novoItem) {
    const li = document.createElement("li");
    li.textContent = novoItem;
    const ul = contentDiv.querySelector('ul') || document.createElement('ul');
    if (!contentDiv.contains(ul)) contentDiv.appendChild(ul);
    ul.appendChild(li);
    savedContent[sectionId] = contentDiv.innerHTML; // Salva as alterações
  }
}

// Função para lidar com o upload de arquivos (PDFs, etc.)
function uploadFile(inputId, displayId) {
  if (!isAdminAuthenticated) {
    alert("Você precisa estar logado como administrador para fazer upload.");
    return;
  }
  const fileInput = document.getElementById(inputId);
  const displayDiv = document.getElementById(displayId);
  const file = fileInput.files[0];
  
  if (file) {
    const fileUrl = URL.createObjectURL(file);
    uploadedFiles[displayId] = { name: file.name, url: fileUrl };
    
    const link = document.createElement('a');
    link.href = fileUrl;
    link.textContent = `Ver ${file.name}`;
    link.target = "_blank";
    link.className = "uploaded-file";
    
    displayDiv.innerHTML = ''; // Limpa uploads anteriores
    displayDiv.appendChild(link);
    
    fileInput.value = ''; // Limpa o input
  }
}

// Função para adicionar itens à galeria
function addToGallery() {
  if (!isAdminAuthenticated) {
    alert("Você precisa estar logado como administrador para adicionar à galeria.");
    return;
  }
  const photoInput = document.getElementById('gallery-photo');
  const messageInput = document.getElementById('gallery-message');
  const photoFile = photoInput.files[0];
  const message = messageInput.value.trim();

  if (!photoFile && !message) {
    alert("Por favor, adicione pelo menos uma foto ou uma mensagem.");
    return;
  }

  const galleryItem = {};
  if (photoFile) {
    galleryItem.photoUrl = URL.createObjectURL(photoFile);
  }
  if (message) {
    galleryItem.message = message;
  }

  galleryItems.push(galleryItem);
  renderGallery();
  
  // Limpa os campos após o upload
  photoInput.value = '';
  messageInput.value = '';
  alert("Item adicionado à galeria com sucesso!");
}

// Função para adicionar documentos
function addDocument() {
  if (!isAdminAuthenticated) {
    alert("Você precisa estar logado como administrador para adicionar documentos.");
    return;
  }
  const fileInput = document.getElementById('document-file');
  const nameInput = document.getElementById('document-name');
  const file = fileInput.files[0];
  const name = nameInput.value.trim();

  if (!file || !name) {
    alert("Por favor, selecione um arquivo e insira um nome para o documento.");
    return;
  }

  const documentUrl = URL.createObjectURL(file);
  documents.push({ name, url: documentUrl });

  renderDocuments();
  
  // Limpa os campos após o upload
  fileInput.value = '';
  nameInput.value = '';
  alert("Documento adicionado com sucesso!");
}

// Função para renderizar a galeria
function renderGallery() {
  const galleryContent = document.getElementById('gallery-content');
  galleryContent.innerHTML = '';

  galleryItems.forEach(item => {
    const galleryItemDiv = document.createElement('div');
    galleryItemDiv.className = 'gallery-item';

    if (item.photoUrl) {
      const img = document.createElement('img');
      img.src = item.photoUrl;
      img.alt = 'Foto da galeria';
      galleryItemDiv.appendChild(img);
    }

    if (item.message) {
      const p = document.createElement('p');
      p.textContent = item.message;
      galleryItemDiv.appendChild(p);
    }

    galleryContent.appendChild(galleryItemDiv);
  });
}

// Função para renderizar os documentos
function renderDocuments() {
  const documentsContent = document.getElementById('documents-content');
  documentsContent.innerHTML = '';

  documents.forEach(doc => {
    const documentItemDiv = document.createElement('div');
    documentItemDiv.className = 'document-item';

    const p = document.createElement('p');
    p.textContent = doc.name;
    const a = document.createElement('a');
    a.href = doc.url;
    a.textContent = 'Download';
    a.target = '_blank';

    documentItemDiv.appendChild(p);
    documentItemDiv.appendChild(a);
    documentsContent.appendChild(documentItemDiv);
  });
}

// Função para download do CV em PDF
function downloadCV() {
  // Cria um contêiner temporário para o PDF
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px'; // Fora da tela
  tempContainer.style.width = '100%';
  tempContainer.style.padding = '20px';

  // Clona o cabeçalho
  const headerClone = document.querySelector('header').cloneNode(true);
  tempContainer.appendChild(headerClone);

  // Clona a foto de perfil
  const profileClone = document.querySelector('.profile-section').cloneNode(true);
  tempContainer.appendChild(profileClone);

  // Clona todas as seções do CV (exceto Galeria e Documentos)
  const sectionsToInclude = ['dados', 'formacao', 'certificacoes', 'expProf', 'estagio', 'habilidades', 'idiomas', 'referencias'];
  sectionsToInclude.forEach(sectionId => {
    const section = document.getElementById(sectionId);
    const sectionClone = section.cloneNode(true);
    sectionClone.style.display = 'block'; // Garante que todas as seções sejam visíveis no PDF
    sectionClone.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none'); // Remove botões de admin
    sectionClone.querySelectorAll('.download-btn').forEach(el => el.style.display = 'none'); // Remove botão de download
    tempContainer.appendChild(sectionClone);
  });

  // Clona o rodapé
  const footerClone = document.querySelector('.footer').cloneNode(true);
  tempContainer.appendChild(footerClone);

  // Adiciona o contêiner temporário ao body
  document.body.appendChild(tempContainer);

  // Configurações do html2pdf
  const opt = {
    margin: 0.5,
    filename: 'CV_Leopoldo_Augusto_Hauela.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true }, // Aumenta a resolução e habilita CORS para imagens
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  // Gera o PDF
  html2pdf().from(tempContainer).set(opt).save().then(() => {
    // Remove o contêiner temporário após gerar o PDF
    document.body.removeChild(tempContainer);
  });
}

// Função para carregar o conteúdo salvo
function loadSavedContent() {
  for (const sectionId in savedContent) {
    const contentDiv = document.getElementById(`${sectionId}-content`);
    if (contentDiv) {
      contentDiv.innerHTML = savedContent[sectionId];
    }
  }
  for (const displayId in uploadedFiles) {
    const displayDiv = document.getElementById(displayId);
    if (displayDiv) {
      const link = document.createElement('a');
      link.href = uploadedFiles[displayId].url;
      link.textContent = `Ver ${uploadedFiles[displayId].name}`;
      link.target = "_blank";
      link.className = "uploaded-file";
      displayDiv.innerHTML = '';
      displayDiv.appendChild(link);
    }
  }
  renderGallery(); // Carrega a galeria ao iniciar
  renderDocuments(); // Carrega os documentos ao iniciar
}

// Ao carregar a página, ativa a aba inicial e carrega o conteúdo salvo
document.addEventListener('DOMContentLoaded', () => {
  openTab('dados');
  loadSavedContent();
  
  if (!isAdminAuthenticated) {
    document.querySelectorAll('.admin-only').forEach(el => {
      el.style.display = 'none';
    });
  }
});