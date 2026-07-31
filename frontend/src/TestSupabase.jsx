import { supabase } from "./services/supabase";

function TestSupabase() {
    async function test() {
        const { data, error } = await supabase.auth.getSession();

        console.log(data);
        console.log(error);

        alert("Supabase Connected!");
    }

    return (
        <button onClick={test}>
            Test Supabase
        </button>
    );
}

export default TestSupabase;