import GenericConverter from './GenericConverter';
import { AREA } from '~/lib/units';
export default function AreaConverter() {
  return <GenericConverter units={AREA} defaultFrom="m2" defaultTo="ft2" groupName="AREA" />;
}
