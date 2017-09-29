import TestComp from './TestComp.vue'

const components = [
  TestComp
];

export default function (Vue) {
  components.map(component => {
    console.log(component.name, component)
    Vue.component(component.name, component)
  });
  // Vue.component('TestComp', TestComp)
}