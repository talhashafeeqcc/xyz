import highlight from './highlight.mjs';

import draw from './draw.mjs';

import edit from './edit.mjs';

import zoomToArea from './zoomToArea.mjs'

export default _xyz => ({

  current: {},

  highlight: highlight(_xyz),

  draw : draw(_xyz),

  edit: edit(_xyz),

  zoomToArea: zoomToArea(_xyz)

});