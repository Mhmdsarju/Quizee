export const paginateAndSearch = async ({model,search,searchFields=[],page=1,limit=10,sort={createdAt:-1},select="",})=>{
  const skip = (page - 1) * limit;
  let query = {};
  if (search && searchFields.length > 0) {
    query.$or = searchFields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    }));
  }
  const data = await model.find(query).select(select).skip(skip).limit(limit).sort(sort);
  const total = await model.countDocuments(query);
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
