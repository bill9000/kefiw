import GenericConverter from './GenericConverter';
import { TIME } from '~/lib/units';
export default function TimeConverter() {
  return <GenericConverter units={TIME} defaultFrom="h" defaultTo="min" defaultValue={1} />;
}
