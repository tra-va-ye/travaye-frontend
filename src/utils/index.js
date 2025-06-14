export function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function addWaterMarkToImage(imageUrl, quality = 90, size = 400) {
  return imageUrl?.replace(
    '/upload/',
    `/upload/q_${quality},w_${size},h_${size},c_fill/l_Assets:watermark/fl_layer_apply,g_north,y_20,o_75,w_${
      size * 0.4
    }/`
  );
}
