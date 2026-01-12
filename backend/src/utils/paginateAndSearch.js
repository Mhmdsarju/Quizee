export const paginateAndSearch = async ({model,query = {},      search = "",searchFields = [],page = 1,limit = 10,sort = { createdAt: -1 },select = "",populate = null,}) => {
  const skip = (page - 1) * limit;

  let finalQuery = { ...query };

  if (search && searchFields.length > 0) {
    finalQuery.$or = searchFields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    }));
  }

  let mongooseQuery = model.find(finalQuery).skip(skip).limit(limit).sort(sort);

  if (select) mongooseQuery = mongooseQuery.select(select);
  if (populate) mongooseQuery = mongooseQuery.populate(populate);

  const data = await mongooseQuery;
  const total = await model.countDocuments(finalQuery);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
