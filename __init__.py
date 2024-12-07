class FastGroupLink:
    @classmethod
    def INPUT_TYPES(s):
        return {"required": {}}
    
    RETURN_TYPES = ()
    FUNCTION = "noop"
    CATEGORY = "utils"

    def noop(self):
        return {}

NODE_CLASS_MAPPINGS = {
    "FastGroupLink": FastGroupLink
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "FastGroupLink": "Fast Group Link"
}

WEB_DIRECTORY = "./web"
