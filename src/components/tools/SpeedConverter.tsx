import GenericConverter from './GenericConverter';
import { SPEED } from '~/lib/units';
export default function SpeedConverter() {
  return <GenericConverter units={SPEED} defaultFrom="kph" defaultTo="mph" defaultValue={100} groupName="SPEED" />;
}
