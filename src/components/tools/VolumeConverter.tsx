import GenericConverter from './GenericConverter';
import { VOLUME } from '~/lib/units';
export default function VolumeConverter() {
  return <GenericConverter units={VOLUME} defaultFrom="l" defaultTo="gal" />;
}
