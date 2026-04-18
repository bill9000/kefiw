import GenericConverter from './GenericConverter';
import { LENGTH } from '~/lib/units';
export default function LengthConverter() {
  return <GenericConverter units={LENGTH} defaultFrom="m" defaultTo="ft" />;
}
