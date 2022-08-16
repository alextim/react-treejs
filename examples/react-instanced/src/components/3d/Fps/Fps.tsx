/*
import { useRef, useMemo, useEffect } from "react";
import { Dom, useFrame, addTail, useThree } from "@react-three/fiber";
import throttle from "lodash-es/throttle";

function Fps() {
  let ref = useRef();
  let last = Date.now();
  const fn = useMemo(() => throttle(fps => (ref.current.innerText = "fps " + fps.toFixed(0)), 60), []);
  useFrame(() => {
    let now = Date.now()
    fn(1 / ((now - last) / 1000))
    last = now
  });
  useEffect(() => addTail(() => fn(0)), []);
  const { viewport } = useThree();
  return <Dom position={[-viewport.width / 2, viewport.height / 2, 0]} className="fps" ref={ref} />;
}

export default Fps;
*/
