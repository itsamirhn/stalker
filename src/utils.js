/**
 * Converts the Data Image URI to a Blob.
 *
 * @param {string} dataURI base64 data image URI.
 * @param {string} mimetype the image mimetype.
 */
var dataURIToBlob = function (dataURI, mimetype) {
  var BASE64_MARKER = ';base64,';
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  var bb = new this.BlobBuilder();
  bb.append(uInt8Array.buffer);
  return bb.getBlob(mimetype);
};

export { dataURIToBlob };
