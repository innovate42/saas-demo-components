// @flow

export type CatalogNode = CatalogItem<any> | CatalogDir

export type CatalogItem<T> = {
    path: string,
    id?: string, //whist id should always be set, its not always stored like this.  Maybe we should create a different type?
    name?: string,
    label?: string,
    type: "item",
    data: T,
    tree?: Array<CatalogItem<any>>,
    version?: string,
    errors?: Array<{ field: string, message: string }>,
    relationship_type?: string,
    status: string,
    start?: string
}

export type CatalogDir = {
    path: string,
    name?: string,
    type: "dir",
    tree?: Array<CatalogItem<any>>
}

export type LimioObject<T> = {
    id: string,
    path: string,
    name: string,
    label: string,
    attributes?: { [string]: any }, // won't exist for families
    record_type: string,
    baseTemplate: string,
    ...T
}

export type Address = $Shape<{
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    address1: string,
    address2: string,
    city: string,
    state: string,
    postalCode: string,
    country: string
}>