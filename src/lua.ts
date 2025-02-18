import { LuaFactory } from "wasmoon";

const factory = new LuaFactory();
const lua = await factory.createEngine({ enableProxy: false });

await lua.doString(`function dump(o)
   if type(o) == 'table' then
      local s = '{ '
      for k,v in pairs(o) do
         if type(k) ~= 'number' then k = '"'..k..'"' end
         s = s .. '['..k..'] = ' .. dump(v) .. ','
      end
      return s .. '} '
   else
      return tostring(o)
   end
end`);

export const load = async (data: string) => {
  console.log(data);
  return await lua.doString(data);
};

export const save = async (data: unknown): Promise<string> => {
  lua.global.set("savedata", data);
  return await lua.doString("return dump(savedata)");
};
