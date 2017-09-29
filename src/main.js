import PlateViewer from './PlateViewer.vue'

const components = [
  PlateViewer
];

export default function (Vue) {
  components.map(component => {
    console.log(component.name, component)
    Vue.component(component.name, component)
  });
}