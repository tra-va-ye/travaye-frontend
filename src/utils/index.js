export function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function addWaterMarkToImage(imageUrl) {
  return imageUrl.replace(
    '/upload/',
    '/upload/l_Assets:watermark/fl_layer_apply,g_north,y_45,o_75,w_800,h_250/'
  );
}
