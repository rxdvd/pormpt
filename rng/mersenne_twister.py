# custom implementation of mersenne twister pseudorandom number generator MT19937
# that stores state by reading and writing to a file for maximum periodicity

import os

class MT19937:
    MAX_VAL = 0xFFFFFFFF
    state_path = os.path.dirname(os.path.realpath(__file__)) + "/mt_state"

    def __init__(self):
        self.index = 0
        self.state = [0] * 624
        self.__load_state()
    
    def seed(self, seed):
        self.index = 624
        self.state[0] = seed
        for i in range(1, 624):
            self.state[i] = (0x6C078965 * (self.state[i-1] ^ (self.state[i-1] >> 30)) + i) & self.MAX_VAL
    
    def next(self):
        if self.index >= 624:
            self.__twist()
        y = self.state[self.index]
        y ^= (y >> 11)
        y ^= (y <<  7) & 0x9D2C5680
        y ^= (y << 15) & 0xEFC60000
        y ^= (y >> 18)
        self.index += 1
        self.__save_state()
        return y & self.MAX_VAL

    def rand_int(self, a, b):
        span = b - a
        lim = self.MAX_VAL - (self.MAX_VAL % span)
        y = self.next()
        while y >= lim:
            y = self.next()
        return a + (y % span)

    def rand(self):
        return self.next() / self.MAX_VAL

    def __twist(self):
        for i in range(624):
            x = (self.state[i] & 0x80000000) + (self.state[(i + 1) % 624] & 0x7FFFFFFF)
            xA = (x >> 1) ^ (0x9908B0DF if x & 1 else 0)
            self.state[i] = self.state[(i + 397) % 624] ^ xA
        self.index = 0

    def __save_state(self):
        open(self.state_path, "wb").write(
            self.index.to_bytes(2, byteorder="little", signed=False) + self.__state_to_bytes()
        )

    def __load_state(self):
        try:
            buffer = open(self.state_path, "rb").read()
            self.index = int.from_bytes(buffer[0:2], byteorder="little", signed=False)
            self.__state_from_bytes(buffer[2:])
        except FileNotFoundError:
            try:
                self.seed(
                    int.from_bytes(
                        open("/dev/urandom", "rb").read(4),
                        byteorder="little", signed=False
                    )
                )
            except:
                self.seed(5489)

    def __state_to_bytes(self):
        out = bytearray()
        for w in self.state:
            for _ in range(4):
                out.append(w & 0xFF)
                w >>= 8
        return bytes(out)
    
    def __state_from_bytes(self, buffer):
        self.state = []
        for i in range(0, len(buffer), 4):
            self.state.append(int.from_bytes(buffer[i:i+4], byteorder="little", signed=False))