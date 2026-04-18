import GenericConverter from './GenericConverter';
import { TEMPERATURE } from '~/lib/units';
export default function TemperatureConverter() {
  return <GenericConverter units={TEMPERATURE} defaultFrom="C" defaultTo="F" defaultValue={100} />;
}
