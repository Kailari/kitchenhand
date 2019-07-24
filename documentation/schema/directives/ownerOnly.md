ownerOnly
=========
Directive for making a resolver targeting some resource callable only by the user who owns it. By default, users with `SUPERUSER` role can bypass this requirement, although for fields for which this could introduce privacy concerns, this can be configured via `canSuperuserAccess`-parameter.

As this requires getting the resource in question from the database for validating ownership, additional arguments and specific resolver format are required for this decorator to work.

### TODO
 - It might be possible to allow setting the `resourceId`-field name via directive args and computed keys
 - It might be possible to directly pass the resource used for validation to the resolver via context/some other more clean way in order to avoid extra db roundtrips. Cannot be done via wrapper due to how codegen and schemas work, passing via context is as close as we can get. Another option is to setup some caching via DataLoader (preferred, but setup is quite involved and requires passing loaders around via context). 
