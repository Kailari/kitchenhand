import { GraphQLResolveInfo } from "graphql";
import { Context } from "../server";
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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
};

export type Mutation = {
  __typename?: "Mutation";
  _empty?: Maybe<Scalars["String"]>;
  registerUser?: Maybe<User>;
  login?: Maybe<Token>;
  addRecipe?: Maybe<Recipe>;
  removeRecipe?: Maybe<Recipe>;
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

export type MutationAddRecipeArgs = {
  name: Scalars["String"];
  description: Scalars["String"];
};

export type MutationRemoveRecipeArgs = {
  id: Scalars["ID"];
};

export type Query = {
  __typename?: "Query";
  _empty?: Maybe<Scalars["String"]>;
  userCount: Scalars["Int"];
  allUsers: Array<User>;
  findUser?: Maybe<User>;
  me?: Maybe<User>;
  recipeCount: Scalars["Int"];
  allRecipes: Array<Recipe>;
  recipe?: Maybe<Recipe>;
  myRecipes: Array<Recipe>;
  userRecipes: Array<Recipe>;
};

export type QueryFindUserArgs = {
  id: Scalars["ID"];
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
  ingredient: Ingredient;
  amount: Scalars["Float"];
  unit: Unit;
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
  _id: Scalars["ID"];
  name: Scalars["String"];
};

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
  Ingredient: ResolverTypeWrapper<Ingredient>;
  Float: ResolverTypeWrapper<Scalars["Float"]>;
  Unit: ResolverTypeWrapper<Unit>;
  Mutation: ResolverTypeWrapper<{}>;
  Token: ResolverTypeWrapper<Token>;
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
  Ingredient: Ingredient;
  Float: Scalars["Float"];
  Unit: Unit;
  Mutation: {};
  Token: Token;
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

export type IngredientResolvers<
  ContextType = Context,
  ParentType = ResolversParentTypes["Ingredient"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
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
  addRecipe?: Resolver<
    Maybe<ResolversTypes["Recipe"]>,
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
    Array<ResolversTypes["Recipe"]>,
    ParentType,
    ContextType
  >;
  userRecipes?: Resolver<
    Array<ResolversTypes["Recipe"]>,
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
  ingredient?: Resolver<ResolversTypes["Ingredient"], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes["Float"], ParentType, ContextType>;
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
  _id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
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
};

/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = Context> = DirectiveResolvers<
  ContextType
>;
export type UserDbObject = {
  _id: any;
  name: string;
  password: string;
  loginname: string;
};

export type RecipeDbObject = {
  _id: any;
  name: string;
  owner: UserDbObject["_id"];
  description?: Maybe<string>;
  ingredients: Array<RecipeIngredientDbObject["_id"]>;
};

export type RecipeIngredientDbObject = {
  _id: any;
  ingredient: IngredientDbObject;
  amount: number;
  unit: UnitDbObject;
};

export type IngredientDbObject = {
  _id: any;
  name: string;
};

export type UnitDbObject = {
  _id: any;
  name: string;
  abbreviation: string;
};
