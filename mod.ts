export interface Descriptor<K extends string> {
  apiVersion: "spec.kure.sh/v1alpha1";
  kind: K;
}

export interface API extends Descriptor<"API"> {
  name: string;
  version: string | null;

  groups: APIGroupIdentifier[];
}

export interface APIGroup extends Descriptor<"APIGroup">, APIGroupIdentifier {
  /** The Kure name of the `API` this group is a part of. */
  api: string;

  versions: string[];
  preferredVersion: string | null;
}

export interface APIGroupIdentifier {
  /** The relative Kure name of the API group, or `null` if this is the API's default group. */
  module: string | null;

  /** The Kubernetes API group name, like `apps` or `cert-manager.io`. */
  name: string;
}

export interface APIGroupVersion extends Descriptor<"APIGroupVersion"> {
  /** The Kure name of the `API` this group version is a part of. */
  api: string;

  /** The Kubernetes API group name, like `apps` or `cert-manager.io`. */
  group: APIGroupIdentifier;

  /** The Kubernetes API group version, like `v1` or `v1beta2`. */
  version: string;

  dependencies: APIDependency[];

  /** The types defined in this API group. */
  definitions: Definition[];
}

export interface APIDependency {
  package: string;
  version: string;
}

export interface Definition<T extends Type = Type> extends DefinitionMeta {
  value: T;
}

export interface DefinitionMeta {
  name: string;
  description?: string;
  deprecated?: true;
}

export interface ResourceType {
  type: "resource";
  properties: Property[];

  metadata: ResourceMeta;
}

export interface ResourceMeta {
  name: string;
  singularName: string;
  kind: string;
  scope: NameScope;
  subresources: Subresources;
}

export type NameScope = "cluster" | "namespace";

export interface Subresources {
  status: boolean;
  scale: boolean;
}

export type Type =
  | StringType
  | NumberType
  | BooleanType
  | ResourceType
  | ObjectType
  | MapType
  | ArrayType
  | UnionType
  | OptionalType
  | UnknownType
  | TypeReference;

export type Kind = Type["type"];

export interface StringType {
  type: "string";

  enum?: string[];
  format?: string; // TODO: pin down

  // TODO: validations?
}

export interface NumberType {
  type: "integer" | "float";
  size?: 32 | 64;

  // TODO: validations?
}

export interface BooleanType {
  type: "boolean";
}

export interface ObjectType {
  type: "object";
  inherit?: TypeReference[];
  properties: Property[];
}

export interface Property extends PropertyMeta {
  value: Type;
}

export interface PropertyMeta extends DefinitionMeta {
  required?: boolean;
}

export interface MapType {
  type: "map";
  values: Type;
}

export interface ArrayType {
  type: "array";
  values: Type;
}

export interface UnionType {
  type: "union";
  values: Type[];
}

export interface OptionalType {
  type: "optional";
  value: Type;
}

export interface UnknownType {
  type: "unknown";
}

export interface TypeReference {
  type: "reference";
  target: ReferenceTarget;
}

export interface ReferenceTarget {
  scope?: ReferenceScope;
  name: string;
}

export interface ReferenceScope {
  package?: string;
  group: APIGroupIdentifier;
  version: string;
}
