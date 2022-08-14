const Lights = () => {
  return (
    <group>
      <ambientLight color={0x404040 } intensity={7} />
      <spotLight color={0xffffff} intensity={2} position={[100, 100, 1]} />
      <spotLight color={0xffffff} intensity={2} position={[-100, 100, 1]} />
    </group>
  );
};

export default Lights;
