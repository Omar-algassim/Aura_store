import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Switch from "@/components/form/switch/Switch";
import Button from "@/components/ui/button/Button";


export default function CountryForm() {
    function handleSave(): void {
        throw new Error("Function not implemented.");
    }

    return(
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                Fill country Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                register new country option in store.
            </p>
        </div>
        <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                <div>
                    <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                        Main information
                    </h5>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <Label>Name *</Label>
                            <Input placeholder="the name of product" type="text" />
                        </div>
                        <div>
                            <Label>Available</Label>
                            <Switch label="Available" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button size="sm" onClick={handleSave}>
                    Save Changes
                </Button>
            </div>
        </form>
    </div>
    )};