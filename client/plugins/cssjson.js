import { toCSS, toJSON } from 'cssjson';

export default ({ app }, inject) => {
    let transform = {
        toCSS: toCSS,
        toJSON: toJSON
    }
    inject('transform', transform);
  }