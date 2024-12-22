import { ErrorWithStatus } from '../../classes/ErrorWithStatus';
import { STATUS_CODES } from '../../constants';
import { User } from '../user/user.model';
import { Blog } from './blog.model';
import type { Types } from 'mongoose';
import type { IBlog, IBlogQuery } from './blog.types';
import type { BanguPayload } from '../../types/interfaces';
import { QueryBuilder } from '../../classes/QueryBuilder';


const saveBlogInDB = async (payload: IBlog, email?: string) => {
	const user = await User.validateUser(email);

	payload.author = user._id;

	const newBlog = await Blog.create(payload);

	if (!newBlog) {
		throw new ErrorWithStatus(
			'Internal Server Error',
			"Couldn't create blog!",
			STATUS_CODES.INTERNAL_SERVER_ERROR,
			'blog',
		);
	}

	const blog = await Blog.findBlogById(newBlog._id);

	return blog;
};

const updateBlogInDB = async (
	id: Types.ObjectId,
	payload: Partial<IBlog>,
	user?: BanguPayload,
) => {
	const existingBlog = await Blog.findBlogById(id);

	if (existingBlog.author.email !== user?.email) {
		throw new ErrorWithStatus(
			'Authorization Error',
			'You do not own this blog!',
			STATUS_CODES.UNAUTHORIZED,
			'auth',
		);
	}

	const updatedBlog = await Blog.findOneAndUpdate({ _id: id }, payload, {
		runValidators: true,
		new: true,
	});

	return updatedBlog;
};


const deleteBlogFromDB = async (id: Types.ObjectId, user?: BanguPayload) => {
	const existingBlog = await Blog.findBlogById(id);

	if (existingBlog.author.email !== user?.email) {
		throw new ErrorWithStatus(
			'Authorization Error',
			'You do not own this blog!',
			STATUS_CODES.UNAUTHORIZED,
			'auth',
		);
	}

	const result = await Blog.deleteOne({ _id: id });

	if (result.deletedCount < 1) {
		throw new ErrorWithStatus(
			'Not Found Error',
			`No blog found with ID ${id}!`,
			STATUS_CODES.NOT_FOUND,
			'blog',
		);
	}
};

const getAllBlogsFromDB = async (query?: IBlogQuery) => {
	const blogQuery = new QueryBuilder(Blog.find(), query)
		.search(['title', 'content'])
		.banguFilter('author', 'filter')
		.filter()
		.sort();

	const blogs = await blogQuery.modelQuery.exec();

	return blogs;
};

export const blogServices = {
	saveBlogInDB,
	updateBlogInDB,
	deleteBlogFromDB,
	getAllBlogsFromDB,
};
