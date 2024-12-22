import { type Query, type FilterQuery, Model } from 'mongoose';

export class QueryBuilder<T> {
	constructor(
		public modelQuery: Query<T[], T> = Model.find(),
		public query?: Record<string, unknown>,
	) {
		this.modelQuery = modelQuery;
		this.query = query;
	}

	search(searchFields: string[]) {
		const keyword = this?.query?.search as string;

		if (keyword) {
			this.modelQuery = this.modelQuery.find({
				$or: searchFields.map(
					(field) =>
						({
							[field]: { $regex: keyword, $options: 'i' },
						}) as FilterQuery<T>,
				),
			});
		}

		return this;
	}

	filter() {
		const queryObj = { ...this.query };

		const excludeFields = [
			'search',
			'sortBy',
			'sortOrder',
			'filter',
			'page',
			'limit',
		];

		excludeFields.forEach((field) => delete queryObj[field]);

		if (Object.keys(queryObj).length > 0) {
			this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
		}

		return this;
	}

	sort() {
		const sortField = (this.query?.sortBy as string) || 'createdAt';
		const sortOrder = (this.query?.sortOrder as string) || 'desc';

		const sortBy: { [key: string]: 1 | -1 } = {};
		sortBy[sortField] = sortOrder === 'asc' ? 1 : -1;

		this.modelQuery = this.modelQuery.sort(sortBy);

		return this;
	}
	blogsFilter(field: keyof T, valueKey: string) {
		const value = this.query?.[valueKey] as string;

		if (value) {
			this.modelQuery = this.modelQuery.find({
				[field]: value,
			} as FilterQuery<T>);
		}

		return this;
	}

	paginate() {
		const page = Number(this?.query?.page) || 1;
		const limit = Number(this?.query?.limit) || 10;
		const skip = (page - 1) * limit;

		this.modelQuery = this.modelQuery.skip(skip).limit(limit);

		return this;
	}
}
