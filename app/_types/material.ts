export type MaterialValue = string | number | boolean;

export interface MaterialProps {
  props: Record<string, MaterialValue | undefined>;
}
