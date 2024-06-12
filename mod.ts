/**
 * The base for all spec types: a pseudo-Kubernetes resource in the
 * `spec.kure.sh` API.
 */
export interface Descriptor<K extends string> {
  apiVersion: "spec.kure.sh/v1alpha1";
  kind: K;
}

/**
 * A Kubernetes API whose resources and types are available in Kure.
 *
 * An API potentially include a number of related {@link APIGroup API groups},
 * and each {@link APIGroupVersion version} of that group available (in this
 * version of the API package).
 */
export interface API extends Descriptor<"API"> {
  name: string;
  version: string | null;

  groups: APIGroupIdentifier[];
}

/** A Kubernetes API group whose resources and types are available in Kure. */
export interface APIGroup extends Descriptor<"APIGroup">, APIGroupIdentifier {
  /** The Kure name of the `API` this group is a part of. */
  api: string;

  /** The {@link APIGroupVersion API versions} of the group (e.g., `v1beta`). */
  versions: string[];

  /** The {@link APIGroupVersion API version} which should be preferred by default. */
  preferredVersion: string | null;
}

/** The identity of an {@link APIGroup}. */
export interface APIGroupIdentifier {
  /** The relative Kure name of the API group, or `null` if this is the API's default group. */
  module: string | null;

  /** The Kubernetes API group name, like `apps` or `cert-manager.io`. */
  name: string;
}

/** Declares all the resources and types in a version of a Kubernetes API. */
export interface APIGroupVersion extends Descriptor<"APIGroupVersion"> {
  /** The Kure name of the `API` this group version is a part of. */
  api: string;

  /** The Kubernetes API group name, like `apps` or `cert-manager.io`. */
  group: APIGroupIdentifier;

  /** The Kubernetes API group version, like `v1` or `v1beta2`. */
  version: string;

  /** API's that this API group depends on. */
  dependencies: APIDependency[];

  /** The types defined in this API group. */
  definitions: Definition[];
}

/** An external {@link API} that an API or {@link APIGroupVersion} depends on. */
export interface APIDependency {
  package: string;
  version: string;
}

/** The base for all {@link Type types} declared in an {@link APIGroupVersion}. */
export interface Definition<T extends Type = Type> extends DefinitionMeta {
  value: T;
}

/** The metadata fields available on every {@link Definition}. */
export interface DefinitionMeta {
  name: string;
  description?: string;
  deprecated?: true;
}

/** A Kubernetes resource. */
export interface ResourceType {
  type: "resource";
  properties: Property[];

  metadata: ResourceMeta;
}

/** The metadata of a {@link ResourceType}. */
export interface ResourceMeta {
  name: string;
  singularName: string;
  kind: string;
  scope: NameScope;
  subresources: Subresources;
}

export type NameScope = "cluster" | "namespace";

/** The Kubernetes subresources available on a {@link resource}. */
export interface Subresources {
  status: boolean;
  scale: boolean;
}

/** A type declared by an {@link APIGroupVersion}. */
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

/** The `type` field of {@link Type}. */
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

/** A reference to another {@link Type}. */
export interface TypeReference {
  type: "reference";
  target: ReferenceTarget;
}

/** The type being referenced in a {@link TypeReference}. */
export interface ReferenceTarget {
  scope?: ReferenceScope;
  name: string;
}

/**
 * The {@link APIGroupIdentifier API group} and (possibly) external package
 * where a {@link TypeReference referenced} type is declared.
 */
export interface ReferenceScope {
  package?: string;
  group: APIGroupIdentifier;
  version: string;
}
