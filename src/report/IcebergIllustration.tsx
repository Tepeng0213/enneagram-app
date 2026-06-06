import iceImg from '../assets/ice.jpg';

interface Props {
  surfacePercent: number;
  innerPercent: number;
}

/** 冰山示意图 */
export function IcebergIllustration({ surfacePercent, innerPercent }: Props) {
  return (
    <img
      src={iceImg}
      alt={`冰山示意：表面自我 ${surfacePercent}%，内在自我 ${innerPercent}%`}
      className="iceberg-ratio__img"
    />
  );
}
