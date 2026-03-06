const form = document.getElementById('eventForm');
const invitePreview = document.getElementById('invitePreview');
let coverImageData = null;

// Upload de imagem
document.getElementById('coverImage').addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = event => {
      coverImageData = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Validação do formulário
form.addEventListener('submit', e => {
  e.preventDefault();

  if (validateForm()) {
    generateInvite();
  }
});

function validateForm() {
  let isValid = true;
  const requiredFields = [
    { id: 'eventTitle', message: 'O título do evento é obrigatório' },
    { id: 'startDate', message: 'A data de início é obrigatória' },
    { id: 'endDate', message: 'A data de fim é obrigatória' },
    { id: 'eventType', message: 'O tipo do evento é obrigatório' },
    { id: 'location', message: 'O local é obrigatório' },
    { id: 'description', message: 'A descrição é obrigatória' },
    { id: 'email', message: 'O e-mail é obrigatório' },
    { id: 'phone', message: 'O telefone é obrigatório' },
  ];

  // Limpar erros anteriores
  document
    .querySelectorAll('.error-message')
    .forEach(el => (el.textContent = ''));
  document
    .querySelectorAll('.error')
    .forEach(el => el.classList.remove('error'));

  requiredFields.forEach(field => {
    const input = document.getElementById(field.id);
    const errorSpan = input.nextElementSibling;

    if (!input.value.trim()) {
      input.classList.add('error');
      errorSpan.textContent = field.message;
      isValid = false;
    }
  });

  // Validação de datas
  const startDate = new Date(document.getElementById('startDate').value);
  const endDate = new Date(document.getElementById('endDate').value);

  if (startDate && endDate && endDate < startDate) {
    const endDateInput = document.getElementById('endDate');
    const errorSpan = endDateInput.nextElementSibling;
    endDateInput.classList.add('error');
    errorSpan.textContent = 'A data de fim deve ser posterior à data de início';
    isValid = false;
  }

  // Validação de e-mail
  const email = document.getElementById('email').value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    const emailInput = document.getElementById('email');
    const errorSpan = emailInput.nextElementSibling;
    emailInput.classList.add('error');
    errorSpan.textContent = 'E-mail inválido';
    isValid = false;
  }

  return isValid;
}

function generateInvite() {
  const title = document.getElementById('eventTitle').value;
  const startDate = new Date(document.getElementById('startDate').value);
  const endDate = new Date(document.getElementById('endDate').value);
  const eventType = document.getElementById('eventType').value;
  const location = document.getElementById('location').value;
  const description = document.getElementById('description').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const primaryColor = document.getElementById('primaryColor').value;
  const theme = document.querySelector('input[name="theme"]:checked').value;
  const style = document.querySelector('input[name="style"]:checked').value;

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  let inviteHTML = `
        <div class="invite-card ${style} theme-${theme}" style="border-top: 8px solid ${primaryColor}">
    `;

  if (coverImageData) {
    inviteHTML += `<img src="${coverImageData}" alt="Capa do evento" class="invite-cover">`;
  }

  inviteHTML += `
            <h2 class="invite-title" style="color: ${primaryColor}">${title}</h2>
            
            <div class="invite-details">
                <div class="invite-detail-item">
                    <strong>📅 Início:</strong> ${formattedStartDate}
                </div>
                <div class="invite-detail-item">
                    <strong>📅 Fim:</strong> ${formattedEndDate}
                </div>
                <div class="invite-detail-item">
                    <strong>${eventType === 'online' ? '💻' : '📍'} Tipo:</strong> ${eventType === 'online' ? 'Online' : 'Presencial'}
                </div>
                <div class="invite-detail-item">
                    <strong>📍 Local:</strong> ${location}
                </div>
            </div>

            <div class="invite-description">
                <strong>Sobre o evento:</strong>
                <p>${description}</p>
            </div>

            <div class="invite-contact">
                <p><strong>📧 E-mail:</strong> ${email}</p>
                <p><strong>📱 Telefone:</strong> ${phone}</p>
            </div>
        </div>
    `;

  invitePreview.innerHTML = inviteHTML;
  invitePreview.classList.remove('hidden');

  // Scroll suave até o convite
  invitePreview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function formatDate(date) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleDateString('pt-BR', options);
}

// Remover erro ao digitar
document.querySelectorAll('input, select, textarea').forEach(input => {
  input.addEventListener('input', () => {
    input.classList.remove('error');
    const errorSpan = input.nextElementSibling;
    if (errorSpan && errorSpan.classList.contains('error-message')) {
      errorSpan.textContent = '';
    }
  });
});
