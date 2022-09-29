import { camelize, capitalize } from "../shared";

export function emit(instance, event: string, ...args) {
  const { props } = instance;
  if (event) {
    const eventName = camelize(capitalize(event));
    const handler = props[`on${eventName}`];
    handler && handler(...args);
  }
}