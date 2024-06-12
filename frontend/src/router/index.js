import { createRouter, createWebHistory } from 'vue-router';
import LoginComponent from '@/components/LoginComponent.vue';
import FormComponent from '@/components/FormComponent.vue';

const routes = [
  {
    path: '/',
    name: 'LoginComponent',
    component: LoginComponent
  },
  {
    path: '/form',
    name: 'FormComponent',
    component: FormComponent,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to,from,next) => {
  let token = localStorage.getItem('jwtToken') || null;
  console.log(token,'lll')
  console.log(to.path,'to.path')
  console.log((to.path === '/' && token?.length > 0),'kkkk')
  if((to.path === '/form' && token === null)){
    next({ path: '/' });
  }
  else{
    if((to.path === '/' && token !== null)){
      next({path:'/form'});
    }
    else{
      next();
    }
   
  }
  
});

export default router;