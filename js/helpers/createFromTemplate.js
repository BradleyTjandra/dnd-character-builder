
export default function (elementId)  {
  let tmpl = document.getElementById(elementId);
  let cloned = tmpl.content.cloneNode(true);
  return(cloned);
}
