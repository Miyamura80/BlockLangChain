import glob

tokens = []
for filename in glob.glob("*.json"):
    print(filename)

    try:
        with open(filename, "r") as f:
            f_str = "\n".join(f.readlines())
            f_str = f_str.replace("true", "True")
            f_str = f_str.replace("false", "Fales")
            token_dict = eval(f_str)
        tokens.append(token_dict)
    except Exception as e:
        print(e)
        print(f_str)

import pickle
with open("token_data.pkl", "wb") as f:
    pickle.dump(tokens, f)
