/**
 * Exposes Mongoose's _id as the domain id field the frontend expects (userId, qrId, ...),
 * and stringifies any ObjectId ref fields listed in `refFields` so JSON responses match the
 * plain-string id shapes defined in the frontend's types/models.ts exactly.
 *
 * Returned as `any` deliberately — Mongoose's SchemaOptions generic signature is invariant
 * over the document shape, which makes a shared helper impossible to type precisely without
 * repeating each model's document type here too. The object shape itself is a plain, standard
 * Mongoose schema-options object; only the static typing is loosened.
 */
export function idTransformOptions(idField: string, refFields: string[] = []): any {
  return {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc: unknown, ret: Record<string, unknown>) => {
        ret[idField] = String(ret._id);
        delete ret._id;
        delete ret.__v;
        for (const field of refFields) {
          if (ret[field] !== undefined && ret[field] !== null) {
            ret[field] = String(ret[field]);
          }
        }
        return ret;
      },
    },
  };
}
