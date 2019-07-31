import { GraphQLResolveInfo } from "graphql";
import { Context } from "../server";
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AdditionalEntityFields = {
  path?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
};

export type Ingredient = {
  __typename?: "Ingredient";
  id: Scalars["ID"];
  name: Scalars["String"];
  defaultUnit?: Maybe<Unit>;
};

export type Mutation = {
  __typename?: "Mutation";
  _empty?: Maybe<Scalars["String"]>;
  registerUser?: Maybe<User>;
  login?: Maybe<Token>;
  addUnit?: Maybe<Unit>;
  removeUnit?: Maybe<Unit>;
  addIngredient?: Maybe<Ingredient>;
  removeIngredient?: Maybe<Ingredient>;
  addRecipe: Recipe;
  removeRecipe?: Maybe<Recipe>;
  addRecipeIngredient?: Maybe<RecipeIngredient>;
  updateRecipeIngredient?: Maybe<RecipeIngredient>;
  removeRecipeIngredient?: Maybe<Scalars["ID"]>;
};

export type MutationRegisterUserArgs = {
  name: Scalars["String"];
  loginname: Scalars["String"];
  password: Scalars["String"];
};

export type MutationLoginArgs = {
  loginname: Scalars["String"];
  password: Scalars["String"];
};

export type MutationAddUnitArgs = {
  name: Scalars["String"];
  abbreviation: Scalars["String"];
};

export type MutationRemoveUnitArgs = {
  id: Scalars["ID"];
};

export type MutationAddIngredientArgs = {
  name: Scalars["String"];
  defaultUnitId: Scalars["ID"];
};

export type MutationRemoveIngredientArgs = {
  id: Scalars["ID"];
};

export type MutationAddRecipeArgs = {
  name: Scalars["String"];
  description: Scalars["String"];
  ingredients?: Maybe<Array<ShallowRecipeIngredient>>;
};

export type MutationRemoveRecipeArgs = {
  id: Scalars["ID"];
};

export type MutationAddRecipeIngredientArgs = {
  recipeId: Scalars["ID"];
};

export type MutationUpdateRecipeIngredientArgs = {
  id: Scalars["ID"];
  recipeId: Scalars["ID"];
  ingredientId?: Maybe<Scalars["ID"]>;
  unitId?: Maybe<Scalars["ID"]>;
  amount?: Maybe<Scalars["Float"]>;
};

export type MutationRemoveRecipeIngredientArgs = {
  recipeId: Scalars["ID"];
  id: Scalars["ID"];
};

export type Query = {
  __typename?: "Query";
  _empty?: Maybe<Scalars["String"]>;
  userCount: Scalars["Int"];
  allUsers: Array<User>;
  findUser?: Maybe<User>;
  me?: Maybe<User>;
  allUnits: Array<Unit>;
  unit?: Maybe<Unit>;
  findUnit: Array<Unit>;
  getIngredient?: Maybe<Ingredient>;
  findIngredient: Array<Ingredient>;
  recipeCount: Scalars["Int"];
  allRecipes: Array<Recipe>;
  recipe?: Maybe<Recipe>;
  myRecipes?: Maybe<Array<Recipe>>;
  userRecipes?: Maybe<Array<Recipe>>;
};

export type QueryFindUserArgs = {
  id: Scalars["ID"];
};

export type QueryUnitArgs = {
  id: Scalars["ID"];
};

export type QueryFindUnitArgs = {
  filter: Scalars["String"];
};

export type QueryGetIngredientArgs = {
  id: Scalars["ID"];
};

export type QueryFindIngredientArgs = {
  filter: Scalars["String"];
};

export type QueryRecipeArgs = {
  id: Scalars["ID"];
};

export type QueryUserRecipesArgs = {
  id: Scalars["ID"];
};

export type Recipe = {
  __typename?: "Recipe";
  id: Scalars["ID"];
  name: Scalars["String"];
  owner: User;
  description?: Maybe<Scalars["String"]>;
  ingredients: Array<RecipeIngredient>;
};

export type RecipeIngredient = {
  __typename?: "RecipeIngredient";
  id: Scalars["ID"];
  amount: Scalars["Float"];
  ingredient: Ingredient;
  unit: Unit;
};

export type ShallowRecipeIngredient = {
  amount: Scalars["Float"];
  ingredient: Scalars["ID"];
  unit: Scalars["ID"];
};

export type Token = {
  __typename?: "Token";
  value: Scalars["String"];
};

export type Unit = {
  __typename?: "Unit";
  id: Scalars["ID"];
  name: Scalars["String"];
  abbreviation: Scalars["String"];
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  name: Scalars["String"];
  recipes: Array<Maybe<Recipe>>;
  permissions: Array<UserPermissions>;
};

export enum UserPermissions {
  Admin = "ADMIN",
  PrivateQueries = "PRIVATE_QUERIES",
  Superuser = "SUPERUSER"
}

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>;
}

export type SubscriptionResolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  User: ResolverTypeWrapper<User>;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  Recipe: ResolverTypeWrapper<Recipe>;
  RecipeIngredient: ResolverTypeWrapper<RecipeIngredient>;
  Float: ResolverTypeWrapper<Scalars["Float"]>;
  Ingredient: ResolverTypeWrapper<Ingredient>;
  Unit: ResolverTypeWrapper<Unit>;
  UserPermissions: UserPermissions;
  Mutation: ResolverTypeWrapper<{}>;
  Token: ResolverTypeWrapper<Token>;
  ShallowRecipeIngredient: ShallowRecipeIngredient;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  AdditionalEntityFields: AdditionalEntityFields;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  String: Scalars["String"];
  Int: Scalars["Int"];
  User: User;
  ID: Scalars["ID"];
  Recipe: Recipe;
  RecipeIngredient: RecipeIngredient;
  Float: Scalars["Float"];
  Ingredient: Ingredient;
  Unit: Unit;
  UserPermissions: UserPermissions;
  Mutation: {};
  Token: Token;
  ShallowRecipeIngredient: ShallowRecipeIngredient;
  Boolean: Scalars["Boolean"];
  AdditionalEntityFields: AdditionalEntityFields;
};

export type UnionDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = {
    discriminatorField?: Maybe<Maybe<Scalars["String"]>>;
    additionalFields?: Maybe<Maybe<Array<Maybe<AdditionalEntityFields>>>>;
  }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AbstractEntityDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = {
    discriminatorField?: Maybe<Scalars["String"]>;
    additionalFields?: Maybe<Maybe<Array<Maybe<AdditionalEntityFields>>>>;
  }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = {
    embedded?: Maybe<Maybe<Scalars["Boolean"]>>;
    additionalFields?: Maybe<Maybe<Array<Maybe<AdditionalEntityFields>>>>;
  }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ColumnDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = { overrideType?: Maybe<Maybe<Scalars["String"]>> }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IdDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = {}
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LinkDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = { overrideType?: Maybe<Maybe<Scalars["String"]>> }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EmbeddedDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = {}
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MapDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = { path?: Maybe<Scalars["String"]> }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type RequirePermissionsDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = {
    permissions?: Maybe<Array<Maybe<UserPermissions>>>;
    canSuperUserAccess?: Maybe<Scalars["Boolean"]>;
  }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type RequireLoginDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = {}
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type OwnerOnlyDirectiveResolver<
  Result,
  Parent,
  ContextType = Context,
  Args = {
    resourceType?: Maybe<Scalars["String"]>;
    idArg?: Maybe<Scalars["String"]>;
    canSuperUserAccess?: Maybe<Scalars["Boolean"]>;
  }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IngredientResolvers<
  ContextType = Context,
  ParentType = ResolversParentTypes["Ingredient"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  defaultUnit?: Resolver<
    Maybe<ResolversTypes["Unit"]>,
    ParentType,
    ContextType
  >;
};

export type MutationResolvers<
  ContextType = Context,
  ParentType = ResolversParentTypes["Mutation"]
> = {
  _empty?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  registerUser?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    MutationRegisterUserArgs
  >;
  login?: Resolver<
    Maybe<ResolversTypes["Token"]>,
    ParentType,
    ContextType,
    MutationLoginArgs
  >;
  addUnit?: Resolver<
    Maybe<ResolversTypes["Unit"]>,
    ParentType,
    ContextType,
    MutationAddUnitArgs
  >;
  removeUnit?: Resolver<
    Maybe<ResolversTypes["Unit"]>,
    ParentType,
    ContextType,
    MutationRemoveUnitArgs
  >;
  addIngredient?: Resolver<
    Maybe<ResolversTypes["Ingredient"]>,
    ParentType,
    ContextType,
    MutationAddIngredientArgs
  >;
  removeIngredient?: Resolver<
    Maybe<ResolversTypes["Ingredient"]>,
    ParentType,
    ContextType,
    MutationRemoveIngredientArgs
  >;
  addRecipe?: Resolver<
    ResolversTypes["Recipe"],
    ParentType,
    ContextType,
    MutationAddRecipeArgs
  >;
  removeRecipe?: Resolver<
    Maybe<ResolversTypes["Recipe"]>,
    ParentType,
    ContextType,
    MutationRemoveRecipeArgs
  >;
  addRecipeIngredient?: Resolver<
    Maybe<ResolversTypes["RecipeIngredient"]>,
    ParentType,
    ContextType,
    MutationAddRecipeIngredientArgs
  >;
  updateRecipeIngredient?: Resolver<
    Maybe<ResolversTypes["RecipeIngredient"]>,
    ParentType,
    ContextType,
    MutationUpdateRecipeIngredientArgs
  >;
  removeRecipeIngredient?: Resolver<
    Maybe<ResolversTypes["ID"]>,
    ParentType,
    ContextType,
    MutationRemoveRecipeIngredientArgs
  >;
};

export type QueryResolvers<
  ContextType = Context,
  ParentType = ResolversParentTypes["Query"]
> = {
  _empty?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  userCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  allUsers?: Resolver<Array<ResolversTypes["User"]>, ParentType, ContextType>;
  findUser?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    QueryFindUserArgs
  >;
  me?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
  allUnits?: Resolver<Array<ResolversTypes["Unit"]>, ParentType, ContextType>;
  unit?: Resolver<
    Maybe<ResolversTypes["Unit"]>,
    ParentType,
    ContextType,
    QueryUnitArgs
  >;
  findUnit?: Resolver<
    Array<ResolversTypes["Unit"]>,
    ParentType,
    ContextType,
    QueryFindUnitArgs
  >;
  getIngredient?: Resolver<
    Maybe<ResolversTypes["Ingredient"]>,
    ParentType,
    ContextType,
    QueryGetIngredientArgs
  >;
  findIngredient?: Resolver<
    Array<ResolversTypes["Ingredient"]>,
    ParentType,
    ContextType,
    QueryFindIngredientArgs
  >;
  recipeCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  allRecipes?: Resolver<
    Array<ResolversTypes["Recipe"]>,
    ParentType,
    ContextType
  >;
  recipe?: Resolver<
    Maybe<ResolversTypes["Recipe"]>,
    ParentType,
    ContextType,
    QueryRecipeArgs
  >;
  myRecipes?: Resolver<
    Maybe<Array<ResolversTypes["Recipe"]>>,
    ParentType,
    ContextType
  >;
  userRecipes?: Resolver<
    Maybe<Array<ResolversTypes["Recipe"]>>,
    ParentType,
    ContextType,
    QueryUserRecipesArgs
  >;
};

export type RecipeResolvers<
  ContextType = Context,
  ParentType = ResolversParentTypes["Recipe"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  ingredients?: Resolver<
    Array<ResolversTypes["RecipeIngredient"]>,
    ParentType,
    ContextType
  >;
};

export type RecipeIngredientResolvers<
  ContextType = Context,
  ParentType = ResolversParentTypes["RecipeIngredient"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
  ingredient?: Resolver<ResolversTypes["Ingredient"], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes["Unit"], ParentType, ContextType>;
};

export type TokenResolvers<
  ContextType = Context,
  ParentType = ResolversParentTypes["Token"]
> = {
  value?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
};

export type UnitResolvers<
  ContextType = Context,
  ParentType = ResolversParentTypes["Unit"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  abbreviation?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
};

export type UserResolvers<
  ContextType = Context,
  ParentType = ResolversParentTypes["User"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  recipes?: Resolver<
    Array<Maybe<ResolversTypes["Recipe"]>>,
    ParentType,
    ContextType
  >;
  permissions?: Resolver<
    Array<ResolversTypes["UserPermissions"]>,
    ParentType,
    ContextType
  >;
};

export type Resolvers<ContextType = Context> = {
  Ingredient?: IngredientResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Recipe?: RecipeResolvers<ContextType>;
  RecipeIngredient?: RecipeIngredientResolvers<ContextType>;
  Token?: TokenResolvers<ContextType>;
  Unit?: UnitResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = Context> = {
  union?: UnionDirectiveResolver<any, any, ContextType>;
  abstractEntity?: AbstractEntityDirectiveResolver<any, any, ContextType>;
  entity?: EntityDirectiveResolver<any, any, ContextType>;
  column?: ColumnDirectiveResolver<any, any, ContextType>;
  id?: IdDirectiveResolver<any, any, ContextType>;
  link?: LinkDirectiveResolver<any, any, ContextType>;
  embedded?: EmbeddedDirectiveResolver<any, any, ContextType>;
  map?: MapDirectiveResolver<any, any, ContextType>;
  requirePermissions?: RequirePermissionsDirectiveResolver<
    any,
    any,
    ContextType
  >;
  requireLogin?: RequireLoginDirectiveResolver<any, any, ContextType>;
  ownerOnly?: OwnerOnlyDirectiveResolver<any, any, ContextType>;
};

/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = Context> = DirectiveResolvers<
  ContextType
>;
export type UserDbObject = {
  _id: any | import("mongoose").Types.ObjectId;
  name: string;
  recipes: Array<Maybe<RecipeDbObject["_id"]>>;
  permissions: Array<string>;
  password: string;
  loginname: string;
};

export type RecipeDbObject = {
  _id: any | import("mongoose").Types.ObjectId;
  name: string;
  owner: UserDbObject["_id"];
  description?: Maybe<string>;
  ingredients: Array<RecipeIngredientDbObject["_id"]>;
};

export type RecipeIngredientDbObject = {
  _id: any | import("mongoose").Types.ObjectId;
  amount: number;
  ingredient: IngredientDbObject["_id"];
  unit: UnitDbObject["_id"];
};

export type IngredientDbObject = {
  _id: any | import("mongoose").Types.ObjectId;
  name: string;
  defaultUnit?: Maybe<UnitDbObject["_id"]>;
};

export type UnitDbObject = {
  _id: any | import("mongoose").Types.ObjectId;
  name: string;
  abbreviation: string;
};
