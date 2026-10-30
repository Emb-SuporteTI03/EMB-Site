<script>
</script>

<template>
  <main class="HEIGHT-4vh BGC-branco">
    
    <div class="HEIGHT-2px BOR-grey"></div>

    <footer class="rodape">
      <p>&copy; {{ new Date().getFullYear() }} Grupo Embalarte - 03.252.307/0001-78</p>
      <p>&nbsp; </p>
      <p>&nbsp; </p>
      <p>&nbsp; </p>
      <p>&nbsp; </p>
      <p>&nbsp; </p>
      <p type="abre-modal" class="abre-modal-termo" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
        Termo de Responsabilidade
      </p>
    </footer>
  
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel"> Termo de Responsabilidade</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
<div class="modal-body">

  <h5><strong>TERMO DE RESPONSABILIDADE E USO DO PORTAL</strong></h5>

  <p>
    Este portal é disponibilizado pela empresa para uso exclusivo de clientes e parceiros comerciais autorizados,
    com a finalidade de consulta de informações relacionadas a pedidos, entregas e demais dados vinculados
    às relações comerciais existentes.
  </p>

  <p>
    Ao acessar o sistema, o usuário declara estar ciente e concordar com as seguintes condições:
  </p>

  <p><strong>1. Uso das Credenciais de Acesso</strong></p>
  <p>
    O acesso ao portal é realizado mediante credenciais individuais (login e senha). O usuário é integralmente
    responsável pela guarda e sigilo dessas informações, comprometendo-se a não compartilhá-las com terceiros.
    Qualquer atividade realizada por meio da conta será considerada de responsabilidade do titular das credenciais.
  </p>

  <p><strong>2. Uso Adequado do Sistema</strong></p>
  <p>
    O portal deve ser utilizado exclusivamente para fins relacionados à consulta de informações comerciais entre as partes.
    É vedado ao usuário:
  </p>

  <ul>
    <li>utilizar o sistema para fins ilícitos ou não autorizados;</li>
    <li>tentar acessar informações que não estejam relacionadas à sua empresa ou às suas permissões;</li>
    <li>realizar qualquer tentativa de violação de segurança, acesso indevido ou interferência no funcionamento do sistema.</li>
  </ul>

  <p><strong>3. Integridade das Informações</strong></p>
  <p>
    A empresa empenha esforços para garantir a exatidão e atualização das informações disponibilizadas no portal.
    Contudo, eventuais divergências podem ocorrer em razão de atualizações operacionais, integrações de sistemas
    ou fatores externos. As informações apresentadas no portal possuem caráter informativo e devem ser confirmadas
    com a empresa em caso de necessidade operacional ou comercial.
  </p>

  <p><strong>4. Disponibilidade do Sistema</strong></p>
  <p>
    A empresa não garante disponibilidade contínua e ininterrupta do portal, podendo ocorrer interrupções temporárias
    para manutenção, atualização de sistemas ou eventos técnicos alheios ao seu controle.
  </p>

  <p><strong>5. Segurança e Monitoramento</strong></p>
  <p>
    Para fins de segurança e auditoria, o sistema poderá registrar informações relacionadas ao acesso dos usuários,
    incluindo data e horário de login e utilização das funcionalidades disponíveis.
  </p>

  <p><strong>6. Proteção de Dados</strong></p>
  <p>
    Os dados utilizados para acesso ao portal são tratados de acordo com as disposições da Lei Geral de Proteção
    de Dados Pessoais (LGPD), sendo utilizados exclusivamente para fins de autenticação, controle de acesso
    e execução das relações comerciais entre as partes.
  </p>

  <p><strong>7. Suspensão de Acesso</strong></p>
  <p>
    A empresa reserva-se o direito de suspender ou revogar o acesso ao portal a qualquer momento em caso
    de uso indevido, violação das regras estabelecidas neste termo ou encerramento da relação comercial.
  </p>

  <p><strong>8. Aceitação</strong></p>
  <p>
    O acesso e utilização deste portal implicam na leitura, compreensão e aceitação integral
    dos termos aqui descritos.
  </p>

  <hr>

  <p><strong>Última atualização:</strong> 09/03/2026</p>

</div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
      </div>
    </div>
  </div>
</div>
    
  </main>
</template>

<style>
.rodape {
  display: flex;
  justify-content: center;
}

.rodape p {
  font-size: 2vh;
}

.abre-modal-termo {
  color: blue; /* Define a cor do texto como azul */
  cursor: pointer; /* Muda o cursor para indicar que o texto é clicável */
  text-decoration: underline; /* Adiciona um sublinhado ao texto */
}

.custom-hr1 {
  margin: 20px 0px 5px 0px;
  border: 0;
  height: 3px;
  background-color: rgb(58, 106, 141);
}
</style>