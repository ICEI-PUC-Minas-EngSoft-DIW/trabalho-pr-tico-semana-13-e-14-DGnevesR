const STORAGE_KEY='zwitter_usuarios';
let usuarios=JSON.parse(localStorage.getItem(STORAGE_KEY))||[];
let editandoId=null;
const form=document.getElementById('formUsuario');
const btnCancelar=document.getElementById('btnCancelar');

function salvarUsuarios(){localStorage.setItem(STORAGE_KEY,JSON.stringify(usuarios))}
function gerarId(){return usuarios.length>0?Math.max(...usuarios.map(u=>u.id))+1:1}

form.addEventListener('submit',e=>{
  e.preventDefault();
  const nome=document.getElementById('nome').value.trim();
  const arroba=document.getElementById('arroba').value.trim();
  const email=document.getElementById('email').value.trim();
  if(!nome||!arroba||!email){alert('Preencha todos os campos!');return}
  if(editandoId){
    const u=usuarios.find(x=>x.id===editandoId);
    u.nome=nome;u.arroba=arroba;u.email=email;
    editandoId=null;btnCancelar.style.display='none'
  }else{
    usuarios.push({id:gerarId(),nome,arroba,email})
  }
  salvarUsuarios();form.reset()
});
btnCancelar.addEventListener('click',()=>{editandoId=null;btnCancelar.style.display='none';form.reset()});