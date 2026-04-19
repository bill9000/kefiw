import GenericConverter from './GenericConverter';
import { WEIGHT } from '~/lib/units';
export default function WeightConverter() {
  return <GenericConverter units={WEIGHT} defaultFrom="kg" defaultTo="lb" groupName="WEIGHT" />;
}
